

export default function Card({title, subTitle, children, footer, className}){
    return (<>
        <div className={`${className}`}>
            <h3 className="text-white font-semibold text-2xl uppercase tracking-wide">{title}</h3>
            <p className="text-white font-semibold text-sm mt-2 tracking-wide">{subTitle}</p>
            <div>{children}</div>
            {footer && <div>{footer}</div>}
        </div>
    </>)
}