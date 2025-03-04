

const HeaderBox = ({ type = "title", title, subtext, user }: HeaderBoxProps) => {
  return (
    <div className="header-box">
      <h1 data-testid={title} className="header-box-title text-xl lg:text-4xl">
        {title}
        {type === 'greeting' && (
          <span className="text-blue-25">
            &nbsp;{user}
          </span>
        )}
      </h1>
      <p data-testid={subtext} className="header-box-subtext text-base lg:text-lg">{subtext}</p>
    </div>
  )
}

export default HeaderBox