import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Post {
  id: number;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
  isLiked: boolean;
}

interface Friend {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
}

interface Message {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: 'Анна Смирнова',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
      content: 'Только что вернулась из невероятного путешествия! Горы, свежий воздух и куча впечатлений 🏔️',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format',
      likes: 234,
      comments: 45,
      time: '2 часа назад',
      isLiked: false
    },
    {
      id: 2,
      author: 'Дмитрий Ковалев',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry',
      content: 'Кто-нибудь знает хорошее кафе в центре? Хочется чего-то уютного ☕',
      likes: 89,
      comments: 23,
      time: '5 часов назад',
      isLiked: true
    },
    {
      id: 3,
      author: 'Мария Петрова',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      content: 'Новый проект наконец запущен! Спасибо команде за поддержку 🚀',
      likes: 456,
      comments: 78,
      time: '8 часов назад',
      isLiked: false
    }
  ]);

  const [friends] = useState<Friend[]>([
    { id: 1, name: 'Елена Волкова', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', online: true },
    { id: 2, name: 'Игорь Соколов', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Igor', online: true },
    { id: 3, name: 'Ольга Морозова', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga', online: false },
    { id: 4, name: 'Сергей Новиков', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sergey', online: true },
  ]);

  const [messages] = useState<Message[]>([
    { id: 1, name: 'Елена Волкова', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', lastMessage: 'Привет! Как дела?', time: '10 мин', unread: 2 },
    { id: 2, name: 'Игорь Соколов', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Igor', lastMessage: 'Созвонимся вечером?', time: '1 час', unread: 0 },
    { id: 3, name: 'Мария Петрова', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', lastMessage: 'Спасибо за помощь!', time: '3 часа', unread: 1 },
  ]);

  const [trends] = useState([
    { id: 1, tag: '#Путешествия', posts: '12.5K' },
    { id: 2, tag: '#Технологии', posts: '8.9K' },
    { id: 3, tag: '#Искусство', posts: '6.2K' },
    { id: 4, tag: '#Музыка', posts: '5.7K' },
    { id: 5, tag: '#Спорт', posts: '4.3K' },
  ]);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Лусо
            </h1>
            <div className="hidden md:flex items-center gap-1">
              <Button 
                variant={activeTab === 'feed' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setActiveTab('feed')}
                className="gap-2"
              >
                <Icon name="Home" size={18} />
                Лента
              </Button>
              <Button 
                variant={activeTab === 'friends' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setActiveTab('friends')}
                className="gap-2"
              >
                <Icon name="Users" size={18} />
                Друзья
              </Button>
              <Button 
                variant={activeTab === 'messages' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setActiveTab('messages')}
                className="gap-2"
              >
                <Icon name="MessageCircle" size={18} />
                Сообщения
              </Button>
              <Button 
                variant={activeTab === 'trends' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setActiveTab('trends')}
                className="gap-2"
              >
                <Icon name="TrendingUp" size={18} />
                Тренды
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Поиск..." 
                className="w-64 pl-10 bg-muted/50"
              />
            </div>
            <Button variant="ghost" size="icon">
              <Icon name="Bell" size={20} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setActiveTab('profile')}>
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                <AvatarFallback>Я</AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </header>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur">
        <div className="grid grid-cols-5 gap-1 p-2">
          <Button 
            variant={activeTab === 'feed' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setActiveTab('feed')}
            className="flex-col h-auto py-2"
          >
            <Icon name="Home" size={20} />
          </Button>
          <Button 
            variant={activeTab === 'friends' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setActiveTab('friends')}
            className="flex-col h-auto py-2"
          >
            <Icon name="Users" size={20} />
          </Button>
          <Button 
            variant={activeTab === 'messages' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setActiveTab('messages')}
            className="flex-col h-auto py-2"
          >
            <Icon name="MessageCircle" size={20} />
          </Button>
          <Button 
            variant={activeTab === 'trends' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setActiveTab('trends')}
            className="flex-col h-auto py-2"
          >
            <Icon name="TrendingUp" size={20} />
          </Button>
          <Button 
            variant={activeTab === 'profile' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setActiveTab('profile')}
            className="flex-col h-auto py-2"
          >
            <Icon name="User" size={20} />
          </Button>
        </div>
      </div>

      <main className="container py-6 px-4 pb-24 md:pb-6">
        {activeTab === 'feed' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <Card className="p-4 bg-card/50 backdrop-blur">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                  <AvatarFallback>Я</AvatarFallback>
                </Avatar>
                <Input placeholder="Что нового?" className="bg-muted/50" />
                <Button className="shrink-0">
                  <Icon name="Send" size={18} />
                </Button>
              </div>
            </Card>

            {posts.map((post, index) => (
              <Card key={post.id} className="overflow-hidden bg-card/50 backdrop-blur animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback>{post.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{post.author}</p>
                      <p className="text-sm text-muted-foreground">{post.time}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Icon name="MoreVertical" size={18} />
                    </Button>
                  </div>
                  
                  <p className="mb-4">{post.content}</p>
                  
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt="Post" 
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`gap-2 ${post.isLiked ? 'text-destructive' : ''}`}
                      onClick={() => handleLike(post.id)}
                    >
                      <Icon name="Heart" size={18} className={post.isLiked ? 'fill-current' : ''} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Icon name="MessageCircle" size={18} />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Icon name="Share2" size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Друзья</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friends.map((friend, index) => (
                <Card key={friend.id} className="p-4 bg-card/50 backdrop-blur animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback>{friend.name[0]}</AvatarFallback>
                      </Avatar>
                      {friend.online && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-accent rounded-full border-2 border-background"></span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{friend.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {friend.online ? 'В сети' : 'Не в сети'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Icon name="MessageCircle" size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            
            <h3 className="text-xl font-bold mt-8 mb-4">Рекомендации</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-4 bg-card/50 backdrop-blur">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Rec${i}`} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">Пользователь {i}</p>
                      <p className="text-sm text-muted-foreground">3 общих друга</p>
                    </div>
                    <Button variant="default" size="sm">
                      Добавить
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Сообщения</h2>
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <Card key={msg.id} className="p-4 bg-card/50 backdrop-blur hover:bg-card/80 transition-colors cursor-pointer animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback>{msg.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold">{msg.name}</p>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{msg.lastMessage}</p>
                    </div>
                    {msg.unread > 0 && (
                      <Badge className="bg-primary">{msg.unread}</Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Актуальные тренды</h2>
            <div className="space-y-3">
              {trends.map((trend, index) => (
                <Card key={trend.id} className="p-4 bg-card/50 backdrop-blur hover:bg-card/80 transition-colors cursor-pointer animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {trend.tag}
                      </p>
                      <p className="text-sm text-muted-foreground">{trend.posts} публикаций</p>
                    </div>
                    <Icon name="TrendingUp" size={24} className="text-accent" />
                  </div>
                </Card>
              ))}
            </div>

            <Card className="mt-6 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <h3 className="text-lg font-bold mb-4">🔥 Популярные трансляции</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Stream${i}`} />
                        <AvatarFallback>S{i}</AvatarFallback>
                      </Avatar>
                      <Badge className="absolute -top-1 -right-1 bg-destructive text-xs px-1">LIVE</Badge>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Трансляция {i}</p>
                      <p className="text-sm text-muted-foreground">{1200 + i * 300} зрителей</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Card className="overflow-hidden bg-card/50 backdrop-blur">
              <div className="h-32 bg-gradient-to-r from-primary via-secondary to-accent"></div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-20 md:-mt-16">
                  <Avatar className="h-32 w-32 border-4 border-background">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                    <AvatarFallback>Я</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center md:text-left mt-16 md:mt-0">
                    <h2 className="text-2xl font-bold">Ваше имя</h2>
                    <p className="text-muted-foreground">@username</p>
                    <p className="mt-4">Люблю путешествовать, фотографировать и делиться моментами жизни ✨</p>
                  </div>
                  <Button className="mt-16 md:mt-0">
                    <Icon name="Settings" size={18} className="mr-2" />
                    Настройки
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8 text-center">
                  <div>
                    <p className="text-2xl font-bold">234</p>
                    <p className="text-sm text-muted-foreground">Публикации</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">1.2K</p>
                    <p className="text-sm text-muted-foreground">Друзья</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">5.6K</p>
                    <p className="text-sm text-muted-foreground">Реакции</p>
                  </div>
                </div>
              </div>
            </Card>

            <Tabs defaultValue="posts" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts">Публикации</TabsTrigger>
                <TabsTrigger value="media">Медиа</TabsTrigger>
                <TabsTrigger value="likes">Понравилось</TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-6 space-y-4">
                {posts.slice(0, 2).map((post) => (
                  <Card key={post.id} className="p-4 bg-card/50 backdrop-blur">
                    <p className="mb-2">{post.content}</p>
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt="Post" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="media" className="mt-6">
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-muted rounded-lg"></div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="likes" className="mt-6">
                <p className="text-center text-muted-foreground py-8">Пока нет понравившихся постов</p>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
