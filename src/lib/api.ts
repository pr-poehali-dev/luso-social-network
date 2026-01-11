const API_BASE = {
  auth: 'https://functions.poehali.dev/1b609dbb-4aa1-4e8b-a20e-199a95f9bb81',
  users: 'https://functions.poehali.dev/7f8f0831-12c8-4f4a-9096-20fdf8495cd0',
  posts: 'https://functions.poehali.dev/9e8c76dd-d50e-4194-8d65-807040ddffba',
  messages: 'https://functions.poehali.dev/7ef247ba-0c61-4d6f-be25-d32934475b36',
  shorts: 'https://functions.poehali.dev/abdfebaf-510c-4dd8-9268-ac49ad01d25f'
};

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  token?: string;
  created_at?: string;
  stats?: {
    posts: number;
    friends: number;
    likes: number;
  };
}

export interface Post {
  id: number;
  user_id: number;
  author: string;
  username: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
  isLiked?: boolean;
}

export interface Chat {
  id: number;
  other_user_id: number;
  username: string;
  name: string;
  avatar: string;
  last_message: string;
  time: string;
  unread: number;
}

export interface Message {
  id: number;
  user_id: number;
  username: string;
  full_name: string;
  avatar: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Comment {
  id: number;
  user_id: number;
  username: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
}

export interface Short {
  id: number;
  user_id: number;
  username: string;
  author: string;
  avatar: string;
  title?: string;
  video_url: string;
  thumbnail?: string;
  views: number;
  likes: number;
  comments: number;
  time: string;
}

export const api = {
  async register(username: string, email: string, password: string, full_name: string) {
    const res = await fetch(API_BASE.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', username, email, password, full_name })
    });
    return res.json();
  },

  async login(username: string, password: string) {
    const res = await fetch(API_BASE.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username, password })
    });
    return res.json();
  },

  async getUser(id: number): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE.users}?id=${id}`);
    return res.json();
  },

  async updateUser(user_id: number, data: Partial<User>) {
    const res = await fetch(API_BASE.users, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, ...data })
    });
    return res.json();
  },

  async getPosts(user_id?: number, current_user?: number): Promise<{ posts: Post[] }> {
    let url = API_BASE.posts;
    const params = new URLSearchParams();
    if (user_id) params.append('user_id', user_id.toString());
    if (current_user) params.append('current_user', current_user.toString());
    if (params.toString()) url += '?' + params.toString();
    const res = await fetch(url);
    return res.json();
  },

  async createPost(user_id: number, content: string, image_url?: string) {
    const res = await fetch(API_BASE.posts, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, content, image_url })
    });
    return res.json();
  },

  async getChats(user_id: number): Promise<{ chats: Chat[] }> {
    const res = await fetch(`${API_BASE.messages}?user_id=${user_id}`);
    return res.json();
  },

  async getMessages(chat_id: number): Promise<{ messages: Message[] }> {
    const res = await fetch(`${API_BASE.messages}?chat_id=${chat_id}`);
    return res.json();
  },

  async createChat(user_id: number, other_user_id: number) {
    const res = await fetch(API_BASE.messages, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_chat', user_id, other_user_id })
    });
    return res.json();
  },

  async sendMessage(chat_id: number, user_id: number, content: string) {
    const res = await fetch(API_BASE.messages, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send_message', chat_id, user_id, content })
    });
    return res.json();
  },

  async likePost(user_id: number, post_id: number) {
    const res = await fetch(API_BASE.posts, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'like', user_id, post_id })
    });
    return res.json();
  },

  async addComment(user_id: number, post_id: number, content: string) {
    const res = await fetch(API_BASE.posts, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'comment', user_id, post_id, content })
    });
    return res.json();
  },

  async getComments(post_id: number): Promise<{ comments: Comment[] }> {
    const res = await fetch(`${API_BASE.posts}?action=comments&post_id=${post_id}`);
    return res.json();
  },

  async getShorts(): Promise<{ shorts: Short[] }> {
    const res = await fetch(API_BASE.shorts);
    return res.json();
  },

  async createShort(user_id: number, title: string, video_url: string, thumbnail_url?: string) {
    const res = await fetch(API_BASE.shorts, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, title, video_url, thumbnail_url })
    });
    return res.json();
  }
};