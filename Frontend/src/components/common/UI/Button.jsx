export default function Button({ children, onClick, className = '', ...rest }) {
  return (
    <button
      onClick={onClick}
      className={"px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition text-white shadow " + className}
      {...rest}
    >
      {children}
    </button>
  )
}
