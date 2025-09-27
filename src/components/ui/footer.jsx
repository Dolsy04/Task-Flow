

export default function Footer(){
    return (<>
        <footer className="w-full h-auto flex items-center justify-center flex-col gap-2 py-3">
            <p className="text-[#1a1d23ce] dark:text-[#f5f5f5] text-sm font-normal capitalize font-[sans]">&copy; {new Date().getFullYear()} - All right reserved</p>
            <p className="text-[#1a1d23ce] dark:text-[#f5f5f5] text-sm font-normal font-[sans]">TASKFLOW</p>
        </footer>
    </>)
}