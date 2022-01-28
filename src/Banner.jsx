const logo = (i) => {
    return (
        <img className="pt-relative max-h-80" src={i} alt="logo"/>
    )
}

const Banner = () => {

    return (
        <div className="row margin-bottom-10">
            <div className="col-md-2">
                {logo("./logo.png")}
            </div>
        </div>
    )

}
export default Banner