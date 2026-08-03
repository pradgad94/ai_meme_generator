import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'ghost'
}

function Button({ children, variant = 'primary', className, ...rest }: ButtonProps) {
  return (
    <button className={`btn btn--${variant}`} {...rest}>
      {children}
    </button>
  )
}

export default Button
