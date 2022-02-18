function sizeHandler(s) {

    if (s > 10 ** 9) {
        return (s / 10.0 ** 9).toFixed(2).toString() + "GB"
    } else if (s < 10 ** 9 && s > 10 ** 6) {
        return (s / 10.0 ** 6).toFixed(2).toString() + "MB"
    } else if (s < 10 ** 6 && s > 10 ** 3) {
        return (s / 10.0 ** 3).toFixed(2).toString() + "KB"
    } else {
        return (s / 1.0).toFixed(2).toString() + "Bit"
    }
}

export {sizeHandler};