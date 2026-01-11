import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для работы с постами, лайками и комментариями'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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
            post_id = params.get('post_id')
            action = params.get('action')
            
            if action == 'comments' and post_id:
                cur.execute("""
                    SELECT c.id, c.user_id, u.username, u.full_name, u.avatar_url, 
                           c.content, c.created_at
                    FROM comments c
                    JOIN users u ON c.user_id = u.id
                    WHERE c.post_id = %s
                    ORDER BY c.created_at DESC
                """, (post_id,))
                
                comments_data = cur.fetchall()
                comments = []
                for comment_data in comments_data:
                    comments.append({
                        'id': comment_data[0],
                        'user_id': comment_data[1],
                        'username': comment_data[2],
                        'author': comment_data[3] or comment_data[2],
                        'avatar': comment_data[4],
                        'content': comment_data[5],
                        'time': comment_data[6].isoformat() if comment_data[6] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'comments': comments}),
                    'isBase64Encoded': False
                }
            
            current_user = params.get('current_user')
            
            if user_id:
                query = """
                    SELECT p.id, p.user_id, u.username, u.full_name, u.avatar_url, 
                           p.content, p.image_url, p.likes_count, p.comments_count, p.created_at,
                           CASE WHEN l.id IS NOT NULL THEN TRUE ELSE FALSE END as is_liked
                    FROM posts p
                    JOIN users u ON p.user_id = u.id
                    LEFT JOIN likes l ON l.post_id = p.id AND l.user_id = %s
                    WHERE p.user_id = %s
                    ORDER BY p.created_at DESC
                    LIMIT %s OFFSET %s
                """
                cur.execute(query, (current_user or 0, user_id, limit, offset))
            else:
                query = """
                    SELECT p.id, p.user_id, u.username, u.full_name, u.avatar_url, 
                           p.content, p.image_url, p.likes_count, p.comments_count, p.created_at,
                           CASE WHEN l.id IS NOT NULL THEN TRUE ELSE FALSE END as is_liked
                    FROM posts p
                    JOIN users u ON p.user_id = u.id
                    LEFT JOIN likes l ON l.post_id = p.id AND l.user_id = %s
                    ORDER BY p.created_at DESC
                    LIMIT %s OFFSET %s
                """
                cur.execute(query, (current_user or 0, limit, offset))
            
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
                    'time': post_data[9].isoformat() if post_data[9] else None,
                    'isLiked': post_data[10]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'posts': posts}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            user_id = body.get('user_id')
            
            if action == 'like':
                post_id = body.get('post_id')
                
                if not user_id or not post_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Укажите user_id и post_id'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("SELECT id FROM likes WHERE user_id = %s AND post_id = %s", (user_id, post_id))
                existing_like = cur.fetchone()
                
                if existing_like:
                    cur.execute("DELETE FROM likes WHERE user_id = %s AND post_id = %s", (user_id, post_id))
                    cur.execute("UPDATE posts SET likes_count = likes_count - 1 WHERE id = %s", (post_id,))
                    conn.commit()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'liked': False}),
                        'isBase64Encoded': False
                    }
                else:
                    cur.execute("INSERT INTO likes (user_id, post_id) VALUES (%s, %s)", (user_id, post_id))
                    cur.execute("UPDATE posts SET likes_count = likes_count + 1 WHERE id = %s RETURNING likes_count", (post_id,))
                    new_count = cur.fetchone()[0]
                    conn.commit()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'liked': True, 'likes_count': new_count}),
                        'isBase64Encoded': False
                    }
            
            elif action == 'comment':
                post_id = body.get('post_id')
                content = body.get('content', '').strip()
                
                if not user_id or not post_id or not content:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Укажите содержание комментария'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "INSERT INTO comments (post_id, user_id, content) VALUES (%s, %s, %s) RETURNING id, created_at",
                    (post_id, user_id, content)
                )
                comment_data = cur.fetchone()
                
                cur.execute("UPDATE posts SET comments_count = comments_count + 1 WHERE id = %s RETURNING comments_count", (post_id,))
                new_count = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'comment': {
                            'id': comment_data[0],
                            'post_id': post_id,
                            'user_id': user_id,
                            'content': content,
                            'created_at': comment_data[1].isoformat() if comment_data[1] else None
                        },
                        'comments_count': new_count
                    }),
                    'isBase64Encoded': False
                }
            
            else:
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