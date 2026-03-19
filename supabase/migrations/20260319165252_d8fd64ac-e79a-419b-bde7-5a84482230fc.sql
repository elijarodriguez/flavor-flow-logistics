
-- Add delivery tracking fields to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS courier TEXT;

-- Create a function to auto-decrement stock when order status changes to Processing
CREATE OR REPLACE FUNCTION public.decrement_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
  -- When order is created, decrement stock for each item
  IF TG_OP = 'INSERT' THEN
    UPDATE public.products p
    SET stock = GREATEST(p.stock - oi.quantity, 0)
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id AND oi.product_id = p.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER decrement_stock_after_order
AFTER INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.decrement_stock_on_order();
