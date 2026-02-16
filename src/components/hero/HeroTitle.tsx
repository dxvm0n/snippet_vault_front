import './HeroTitle.css'

type HeroTitleProps = {
  title?: string
}

function HeroTitle({ title = '>> Snippet Vault' }: HeroTitleProps) {
  return <h2 className="hero-title">{title}</h2>
}

export default HeroTitle
