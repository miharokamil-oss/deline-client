-- Создание таблицы заказов для Xsolla платежей
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL, -- Изменено с UUID на TEXT для совместимости
  user_email TEXT,
  product_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_token TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Комментарии к таблице
COMMENT ON TABLE orders IS 'Таблица заказов и платежей через Xsolla';
COMMENT ON COLUMN orders.order_id IS 'Уникальный идентификатор заказа';
COMMENT ON COLUMN orders.user_id IS 'ID пользователя (текстовый формат)';
COMMENT ON COLUMN orders.user_email IS 'Email пользователя';
COMMENT ON COLUMN orders.product_name IS 'Название купленного товара';
COMMENT ON COLUMN orders.amount IS 'Сумма платежа в рублях';
COMMENT ON COLUMN orders.status IS 'Статус заказа: pending, completed, failed, refunded';
COMMENT ON COLUMN orders.payment_token IS 'Токен платежа от Xsolla';
COMMENT ON COLUMN orders.transaction_id IS 'ID транзакции от Xsolla';
COMMENT ON COLUMN orders.metadata IS 'Дополнительные данные в формате JSON';
