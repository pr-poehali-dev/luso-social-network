import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <h1 className="ml-4 text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Правила использования
          </h1>
        </div>
      </header>

      <main className="container max-w-4xl py-8 px-4">
        <Card className="p-8 bg-card/50 backdrop-blur">
          <h2 className="text-2xl font-bold mb-6">Правила использования Лусо</h2>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">1. Общие положения</h3>
              <p>
                Добро пожаловать в Лусо! Используя наш сервис, вы соглашаетесь соблюдать настоящие правила.
                Мы создали платформу для общения, обмена контентом и поддержания связи с друзьями.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">2. Учетная запись</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Вы несете ответственность за безопасность своего аккаунта</li>
                <li>Запрещено создавать несколько аккаунтов для одного человека</li>
                <li>Нельзя передавать свой аккаунт другим лицам</li>
                <li>Минимальный возраст пользователя — 13 лет</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">3. Контент</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Запрещено публиковать незаконный, вредоносный или оскорбительный контент</li>
                <li>Не размещайте материалы, нарушающие авторские права</li>
                <li>Запрещена дезинформация и спам</li>
                <li>Мы можем удалить контент, нарушающий эти правила</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">4. Конфиденциальность</h3>
              <p>
                Мы уважаем вашу конфиденциальность. Подробнее о том, как мы обрабатываем ваши данные,
                читайте в разделе <span className="text-primary cursor-pointer" onClick={() => navigate('/privacy')}>Политика конфиденциальности</span>.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">5. Ответственность</h3>
              <p>
                Лусо предоставляется "как есть". Мы не несем ответственности за ущерб, возникший в результате
                использования сервиса. Вы используете платформу на свой риск.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">6. Изменения правил</h3>
              <p>
                Мы можем обновлять эти правила время от времени. Продолжая использовать Лусо после изменений,
                вы соглашаетесь с новыми условиями.
              </p>
            </section>

            <section className="pt-4 border-t border-border">
              <p className="text-sm">
                Последнее обновление: 11 января 2026 года
              </p>
              <p className="text-sm mt-2">
                По вопросам свяжитесь с нами через голосового помощника <span className="text-primary font-semibold">Умпо</span>
              </p>
            </section>
          </div>
        </Card>
      </main>
    </div>
  );
}
