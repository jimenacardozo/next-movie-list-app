type FormProps = React.FormHTMLAttributes<HTMLFormElement>

export default function Form({ className = "", children, ...props }: FormProps) {
  return (
    <form className={`space-y-4 ${className}`} {...props}>
      {children}
    </form>
  )
}
