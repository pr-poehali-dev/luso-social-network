import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для работы с постами'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        if method == 'GET':
            limit = int(event.get('queryStringParameters', {}).get('limit', 20))
            offset = int(event.get('queryStringParameters', {}).get('offset', 0))
            user_id = event.get('queryStringParameters', {}).get('user_id')
            
            if user_id:
                cur.execute("""
                    SELECT p.id, p.user_id, u.username, u.full_name, u.avatar_url, 
                           p.content, p.image_url, p.likes_count, p.comments_count, p.created_at
                    FROM posts p
                    JOIN users u ON p.user_id = u.id
                    WHERE p.user_id = %s
                    ORDER BY p.created_at DESC
                    LIMIT %s OFFSET %s
                """, (user_id, limit, offset))
            else:
                cur.execute("""
                    SELECT p.id, p.user_id, u.username, u.full_name, u.avatar_url, 
                           p.content, p.image_url, p.likes_count, p.comments_count, p.created_at
                    FROM posts p
                    JOIN users u ON p.user_id = u.id
                    ORDER BY p.created_at DESC
                    LIMIT %s OFFSET %s
                """, (limit, offset))
            
            posts_data = cur.fetchall()
            
            posts = []
            for post_data in posts_data:
                posts.append({
                    'id': post_data[0],
                    'user_id': post_data[1],
                    'author': post_data[3] or post_data[2],
                    'username': post_data[2],
                    'avatar': post_data[4],
                    'content': post_data[5],
                    'image': post_data[6],
                    'likes': post_data[7],
                    'comments': post_data[8],
                    'time': post_data[9].isoformat() if post_data[9] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'posts': posts}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            content = body.get('content', '').strip()
            image_url = body.get('image_url')
            
            if not user_id or not content:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Укажите содержание поста'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "INSERT INTO posts (user_id, content, image_url) VALUES (%s, %s, %s) RETURNING id, created_at",
                (user_id, content, image_url)
            )
            post_data = cur.fetchone()
            conn.commit()
            
            post = {
                'id': post_data[0],
                'user_id': user_id,
                'content': content,
                'image_url': image_url,
                'likes': 0,
                'comments': 0,
                'created_at': post_data[1].isoformat() if post_data[1] else None
            }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'post': post}),
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
