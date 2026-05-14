type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full bg-[#1c1c1f] text-white rounded-lg px-4 py-2.5 text-sm outline-none border border-white/10 focus:border-white/30 ${className}`}
      {...props}
    />
  )
}
