function manage() {
    console.log("abc")
}

const LeftSideNavbar = () => {

    return (

        <ul className="nav flex-column">
            <li className="nav-item">
                <a onClick={manage}>任务管理</a>
            </li>
        </ul>

    )
}

export default LeftSideNavbar