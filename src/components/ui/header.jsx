
export default function Header({children, className}){
    return (<>
        <header className={`${className}`}>
            {children}
        </header>
    </>)
}