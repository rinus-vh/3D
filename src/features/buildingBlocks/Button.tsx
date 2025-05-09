import { cva, type VariantProps } from 'class-variance-authority';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 transition-colors duration-200',
  {
    variants: {
      variant: {
        white: 'bg-white text-black hover:bg-white/90',
        grey: 'bg-white/10 hover:bg-white/20',
        red: 'bg-red-500 text-black hover:bg-red-600',
        outline: 'border border-white/20 hover:bg-white/10',
      },
      size: {
        default: 'py-2 px-4',
        icon: 'p-1 rounded',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'white',
      size: 'default',
      fullWidth: false,
    },
  }
);

interface ButtonBaseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  icon?: typeof LucideIcon;
  label: string,
}

const ButtonBase: React.FC<ButtonBaseProps> = ({
  label,
  className,
  variant,
  size,
  fullWidth,
  icon: Icon = undefined,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {Icon && <Icon size={size === 'icon' ? 16 : 20} />}
      <span>{label}</span>
    </button>
  );
};

export const ButtonWhite: React.FC<ButtonBaseProps> = (props) => (
  <ButtonBase variant="white" {...props} />
);

export const ButtonGrey: React.FC<ButtonBaseProps> = (props) => (
  <ButtonBase variant="grey" {...props} />
);

export const ButtonRed: React.FC<ButtonBaseProps> = (props) => (
  <ButtonBase variant="red" {...props} />
);

export const ButtonOutline: React.FC<ButtonBaseProps> = (props) => (
  <ButtonBase variant="outline" {...props} />
);