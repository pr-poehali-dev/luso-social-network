import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, User } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export default function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await api.login(formData.username, formData.password);
      } else {
        result = await api.register(
          formData.username,
          formData.email,
          formData.password,
          formData.full_name
        );
      }

      if (result.error) {
        toast({
          title: 'Ошибка',
          description: result.error,
          variant: 'destructive'
        });
      } else if (result.user) {
        localStorage.setItem('luso_user', JSON.stringify(result.user));
        toast({
          title: 'Успешно',
          description: isLogin ? 'Добро пожаловать!' : 'Аккаунт создан!'
        });
        onSuccess(result.user);
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {isLogin ? 'Вход в Лусо' : 'Регистрация в Лусо'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="username">Имя пользователя</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="full_name">Полное имя</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Есть аккаунт? Войдите'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
