const Instructions = () => {
    return (
        <div className='md:w-[50%] w-[100%] h-[80vh] md:h-screen  bg-dark-offset/40  flex round flex-col justify-center items-center'>
            <h1 className='text-[4rem] font-medium'>Instructions</h1>

            <div className=' relative px-4 md:px-[1em] md:leading-loose'>
                <div className='bg-[#f9e69a] text-black leading-snug rounded font-medium px-[.5em] py-[1.5em] mt-[3em] mb-3 '>
                    <h3> <i className="ri-file-warning-fill"></i> <b>Crucial Information:</b>Read Before Proceeding</h3>
                    <p>To ensure a smooth and successful process, please take a moment to carefully review these essential instructions:</p>
                </div>
                <ul className=''>
                    <li><b className='important'>Data loss: </b> Following these steps precisely is critical to safeguard your data. Any deviations could lead to permanent data loss.</li>
                    <li><b className='important'>Final Choices: </b>Once you've made your selections, they become permanent and cannot be edited or changed later. Choose wisely!</li>
                    <li> <b className='important'>Avoid Refreshing: </b> Refrain from refreshing the page during the selection process. Doing so can cause data loss or errors.</li>
                </ul>
            </div>
        </div>
    )
}

export default Instructions