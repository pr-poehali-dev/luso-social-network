import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <h1 className="ml-4 text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Политика конфиденциальности
          </h1>
        </div>
      </header>

      <main className="container max-w-4xl py-8 px-4">
        <Card className="p-8 bg-card/50 backdrop-blur">
          <h2 className="text-2xl font-bold mb-6">Политика конфиденциальности Лусо</h2>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">1. Какие данные мы собираем</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Имя пользователя, email и пароль при регистрации</li>
                <li>Профильная информация (имя, био, фото профиля и обложка)</li>
                <li>Публикуемый контент (посты, комментарии, сообщения, шортс)</li>
                <li>Данные о взаимодействиях (лайки, друзья, просмотры)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">2. Как мы используем данные</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Предоставление и улучшение сервиса Лусо</li>
                <li>Персонализация контента и рекомендаций</li>
                <li>Обеспечение безопасности платформы</li>
                <li>Общение с вами по вопросам поддержки</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">3. Защита данных</h3>
              <p>
                Мы применяем современные меры безопасности для защиты ваших данных:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Шифрование паролей</li>
                <li>Безопасное хранение данных</li>
                <li>Регулярные проверки безопасности</li>
                <li>Ограниченный доступ к личным данным</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">4. Передача данных третьим лицам</h3>
              <p>
                Мы не продаем ваши персональные данные. Данные могут быть переданы только:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>По требованию закона</li>
                <li>Для защиты прав и безопасности пользователей</li>
                <li>С вашего явного согласия</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">5. Ваши права</h3>
              <p>Вы имеете право:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Получить доступ к своим данным</li>
                <li>Исправить неточную информацию</li>
                <li>Удалить свой аккаунт и данные</li>
                <li>Отозвать согласие на обработку данных</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">6. Cookies и аналитика</h3>
              <p>
                Мы используем cookies для улучшения работы сайта и анализа его использования.
                Вы можете управлять cookies в настройках браузера.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">7. Изменения политики</h3>
              <p>
                Мы можем обновлять эту политику конфиденциальности. О существенных изменениях
                мы уведомим вас заранее.
              </p>
            </section>

            <section className="pt-4 border-t border-border">
              <p className="text-sm">
                Последнее обновление: 11 января 2026 года
              </p>
              <p className="text-sm mt-2">
                По вопросам конфиденциальности обращайтесь к голосовому помощнику <span className="text-primary font-semibold">Умпо</span>
              </p>
            </section>
          </div>
        </Card>
      </main>
    </div>
  );
}
