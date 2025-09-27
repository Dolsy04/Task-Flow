

export default function Button({children, className}){
    return (<>
        <button className={`${className}`}>
            <div>{children}</div>
        </button>
    </>)
}