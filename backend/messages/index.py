import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для работы с чатами и сообщениями'''
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
            user_id = event.get('queryStringParameters', {}).get('user_id')
            chat_id = event.get('queryStringParameters', {}).get('chat_id')
            
            if chat_id:
                cur.execute("""
                    SELECT m.id, m.user_id, u.username, u.full_name, u.avatar_url,
                           m.content, m.is_read, m.created_at
                    FROM messages m
                    JOIN users u ON m.user_id = u.id
                    WHERE m.chat_id = %s
                    ORDER BY m.created_at ASC
                """, (chat_id,))
                
                messages_data = cur.fetchall()
                
                messages = []
                for msg_data in messages_data:
                    messages.append({
                        'id': msg_data[0],
                        'user_id': msg_data[1],
                        'username': msg_data[2],
                        'full_name': msg_data[3],
                        'avatar': msg_data[4],
                        'content': msg_data[5],
                        'is_read': msg_data[6],
                        'created_at': msg_data[7].isoformat() if msg_data[7] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'messages': messages}),
                    'isBase64Encoded': False
                }
            
            elif user_id:
                cur.execute("""
                    SELECT DISTINCT c.id, 
                           CASE 
                               WHEN cp1.user_id = %s THEN cp2.user_id
                               ELSE cp1.user_id
                           END as other_user_id,
                           u.username, u.full_name, u.avatar_url,
                           (SELECT content FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
                           (SELECT created_at FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
                           (SELECT COUNT(*) FROM messages WHERE chat_id = c.id AND user_id != %s AND is_read = FALSE) as unread_count
                    FROM chats c
                    JOIN chat_participants cp1 ON c.id = cp1.chat_id
                    JOIN chat_participants cp2 ON c.id = cp2.chat_id AND cp2.user_id != cp1.user_id
                    JOIN users u ON u.id = CASE WHEN cp1.user_id = %s THEN cp2.user_id ELSE cp1.user_id END
                    WHERE cp1.user_id = %s OR cp2.user_id = %s
                    ORDER BY last_message_time DESC
                """, (user_id, user_id, user_id, user_id, user_id))
                
                chats_data = cur.fetchall()
                
                chats = []
                for chat_data in chats_data:
                    chats.append({
                        'id': chat_data[0],
                        'other_user_id': chat_data[1],
                        'username': chat_data[2],
                        'name': chat_data[3] or chat_data[2],
                        'avatar': chat_data[4],
                        'last_message': chat_data[5],
                        'time': chat_data[6].isoformat() if chat_data[6] else None,
                        'unread': chat_data[7]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'chats': chats}),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Укажите user_id или chat_id'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'create_chat':
                user_id = body.get('user_id')
                other_user_id = body.get('other_user_id')
                
                if not user_id or not other_user_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Укажите обоих пользователей'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("""
                    SELECT c.id FROM chats c
                    JOIN chat_participants cp1 ON c.id = cp1.chat_id AND cp1.user_id = %s
                    JOIN chat_participants cp2 ON c.id = cp2.chat_id AND cp2.user_id = %s
                """, (user_id, other_user_id))
                
                existing_chat = cur.fetchone()
                
                if existing_chat:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'chat_id': existing_chat[0]}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("INSERT INTO chats DEFAULT VALUES RETURNING id")
                chat_id = cur.fetchone()[0]
                
                cur.execute("INSERT INTO chat_participants (chat_id, user_id) VALUES (%s, %s), (%s, %s)", 
                           (chat_id, user_id, chat_id, other_user_id))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'chat_id': chat_id}),
                    'isBase64Encoded': False
                }
            
            elif action == 'send_message':
                chat_id = body.get('chat_id')
                user_id = body.get('user_id')
                content = body.get('content', '').strip()
                
                if not chat_id or not user_id or not content:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заполните все поля'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "INSERT INTO messages (chat_id, user_id, content) VALUES (%s, %s, %s) RETURNING id, created_at",
                    (chat_id, user_id, content)
                )
                message_data = cur.fetchone()
                conn.commit()
                
                message = {
                    'id': message_data[0],
                    'chat_id': chat_id,
                    'user_id': user_id,
                    'content': content,
                    'created_at': message_data[1].isoformat() if message_data[1] else None
                }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': message}),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неизвестное действие'}),
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
