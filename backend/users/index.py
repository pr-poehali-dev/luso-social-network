import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для управления профилем пользователя'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        if method == 'GET':
            user_id = event.get('queryStringParameters', {}).get('id')
            
            if user_id:
                cur.execute(
                    "SELECT id, username, full_name, bio, avatar_url, cover_url, created_at FROM users WHERE id = %s",
                    (user_id,)
                )
                user_data = cur.fetchone()
                
                if not user_data:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пользователь не найден'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("SELECT COUNT(*) FROM posts WHERE user_id = %s", (user_id,))
                posts_count = cur.fetchone()[0]
                
                cur.execute("SELECT COUNT(*) FROM friendships WHERE (user_id = %s OR friend_id = %s) AND status = 'accepted'", (user_id, user_id))
                friends_count = cur.fetchone()[0]
                
                cur.execute("SELECT COUNT(*) FROM likes WHERE user_id = %s", (user_id,))
                likes_count = cur.fetchone()[0]
                
                user = {
                    'id': user_data[0],
                    'username': user_data[1],
                    'full_name': user_data[2],
                    'bio': user_data[3],
                    'avatar_url': user_data[4],
                    'cover_url': user_data[5],
                    'created_at': user_data[6].isoformat() if user_data[6] else None,
                    'stats': {
                        'posts': posts_count,
                        'friends': friends_count,
                        'likes': likes_count
                    }
                }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'user': user}),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Укажите ID пользователя'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            full_name = body.get('full_name')
            bio = body.get('bio')
            avatar_url = body.get('avatar_url')
            cover_url = body.get('cover_url')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Укажите ID пользователя'}),
                    'isBase64Encoded': False
                }
            
            update_fields = []
            update_values = []
            
            if full_name is not None:
                update_fields.append('full_name = %s')
                update_values.append(full_name)
            if bio is not None:
                update_fields.append('bio = %s')
                update_values.append(bio)
            if avatar_url is not None:
                update_fields.append('avatar_url = %s')
                update_values.append(avatar_url)
            if cover_url is not None:
                update_fields.append('cover_url = %s')
                update_values.append(cover_url)
            
            if not update_fields:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Нет данных для обновления'}),
                    'isBase64Encoded': False
                }
            
            update_fields.append('updated_at = CURRENT_TIMESTAMP')
            update_values.append(user_id)
            
            query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = %s RETURNING id, username, full_name, bio, avatar_url, cover_url"
            
            cur.execute(query, update_values)
            user_data = cur.fetchone()
            conn.commit()
            
            if not user_data:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пользователь не найден'}),
                    'isBase64Encoded': False
                }
            
            user = {
                'id': user_data[0],
                'username': user_data[1],
                'full_name': user_data[2],
                'bio': user_data[3],
                'avatar_url': user_data[4],
                'cover_url': user_data[5]
            }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'user': user}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
