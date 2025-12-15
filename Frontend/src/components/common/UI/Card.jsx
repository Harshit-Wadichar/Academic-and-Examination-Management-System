export default function Card({ children, className = '' }) {
  return <div className={"fancy-card glass " + className}>{children}</div>
}
