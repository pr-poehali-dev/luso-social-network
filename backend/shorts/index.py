import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для работы с короткими видео (шортс)'''
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
            params = event.get('queryStringParameters', {})
            limit = int(params.get('limit', 20))
            offset = int(params.get('offset', 0))
            user_id = params.get('user_id')
            
            if user_id:
                cur.execute("""
                    SELECT s.id, s.user_id, u.username, u.full_name, u.avatar_url,
                           s.title, s.video_url, s.thumbnail_url, s.views_count, 
                           s.likes_count, s.comments_count, s.created_at
                    FROM shorts s
                    JOIN users u ON s.user_id = u.id
                    WHERE s.user_id = %s
                    ORDER BY s.created_at DESC
                    LIMIT %s OFFSET %s
                """, (user_id, limit, offset))
            else:
                cur.execute("""
                    SELECT s.id, s.user_id, u.username, u.full_name, u.avatar_url,
                           s.title, s.video_url, s.thumbnail_url, s.views_count, 
                           s.likes_count, s.comments_count, s.created_at
                    FROM shorts s
                    JOIN users u ON s.user_id = u.id
                    ORDER BY s.created_at DESC
                    LIMIT %s OFFSET %s
                """, (limit, offset))
            
            shorts_data = cur.fetchall()
            
            shorts = []
            for short_data in shorts_data:
                shorts.append({
                    'id': short_data[0],
                    'user_id': short_data[1],
                    'username': short_data[2],
                    'author': short_data[3] or short_data[2],
                    'avatar': short_data[4],
                    'title': short_data[5],
                    'video_url': short_data[6],
                    'thumbnail': short_data[7],
                    'views': short_data[8],
                    'likes': short_data[9],
                    'comments': short_data[10],
                    'time': short_data[11].isoformat() if short_data[11] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'shorts': shorts}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            title = body.get('title', '').strip()
            video_url = body.get('video_url', '').strip()
            thumbnail_url = body.get('thumbnail_url')
            
            if not user_id or not video_url:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Укажите видео'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "INSERT INTO shorts (user_id, title, video_url, thumbnail_url) VALUES (%s, %s, %s, %s) RETURNING id, created_at",
                (user_id, title, video_url, thumbnail_url)
            )
            short_data = cur.fetchone()
            conn.commit()
            
            short = {
                'id': short_data[0],
                'user_id': user_id,
                'title': title,
                'video_url': video_url,
                'thumbnail_url': thumbnail_url,
                'views': 0,
                'likes': 0,
                'comments': 0,
                'created_at': short_data[1].isoformat() if short_data[1] else None
            }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'short': short}),
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
