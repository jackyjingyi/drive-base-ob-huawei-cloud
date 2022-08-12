// 路径索引

export const bucketName = 'oct-project-collection'
export const s3server = `obs.cn-south-1.myhuaweicloud.com`
export const companyID = {
    chinaEast: '华东集团', chinaMiddle: '中部集团', chinaNorth: '北方集团', chinaSouth: '华南集团', chinaWest: '西部集团'
}
export const mainFolder = {
    productDB: '华侨城集团地产产品库V1.0'
}
export const productDBName = '产品库'
export const productType = {
    highBuilding: '01.高层19-33F',
    medianBuilding: '02.中高层12-18F',
    lowBuilding: '03.小高层7-11F',
}


// 组合路径, TODO: DELETE AFTER CHANGE
const RegionDict = {
    chinaEast: `${mainFolder.productDB}/${companyID.chinaEast}/`,
    chinaMiddle: `${mainFolder.productDB}/${companyID.chinaMiddle}/`,
    chinaNorth: `${mainFolder.productDB}/${companyID.chinaNorth}/`,
    chinaSouth: `${mainFolder.productDB}/${companyID.chinaSouth}/`,
    chinaWest: `${mainFolder.productDB}/${companyID.chinaWest}/`
}

export function companyProductDir(company, type = null) {
    // company: chinaEast
    // type : highBuilding
    let dir = `${mainFolder.productDB}/${companyID[company]}/${productDBName}/`
    if (productType) {
        dir = `${dir}${productType[type]}/`
    }
    return dir
}

// 左侧的搜索栏目
export const searchDataGrim =
    [
    {
        index: 0, title: '所属战区', tags: [{
        name: '华东战区', link: `/region-company/chinaEast`, // react router link
    }, {
        name: '西部战区', link: `/region-company/chinaWest`, // react router link
    }, {
        name: '华南战区', link: `/region-company/chinaSouth`, // react router link
    }, {
        name: '北方战区', link: `/region-company/chinaNorth`, // react router link
    }, {
        name: '中部战区', link: `/region-company/chinaMiddle`, // react router link
    },]

}, {
    index: 1, title: '所属地区', tags: [{
        name: '北京', link: null,
    }, {
        name: '广州', link: null,
    }, {
        name: '上海', link: null,
    }, {
        name: '南京', link: null,
    }, {
        name: '深圳', link: null,
    }, {
        name: '...', link: null,
    },
    ]
},
    {
        index: 2, title: '标签筛选检索', tags: [
            {name: '落地产品', link: null},
            {name: '研发产品', link: null},
            {name: '落地迭代产品', link: null},
            {name: '创新产品', link: null},
            {name: '优秀竞品产品', link: null},
        ]
    },
    {
        index: 3, title: '产品类型', tags: [
            {name: '超高层', link: null},
            {name: '小高层', link: null},
            {name: '高层', link: null},
            {name: '洋房', link: null},
            {name: '中高层', link: null},
            {name: '别墅', link: null},
        ]
    },
    {
        index: 4, title: '层数类型', tags: [
            {name: '34F以上', link: null},
            {name: '7-11F', link: null},
            {name: '19-33F', link: null},
            {name: '4-6F', link: null},
            {name: '12-18F', link: null},
            {name: '2-3F', link: null},
        ]
    }, {
        index: 5, title: '组合方式', tags: [
            {name: '1T2', link: null},
            {name: '2T4', link: null},
            {name: '2T2', link: null},
            {name: '3T5', link: null},
            {name: '2T3', link: null},
            {name: '3T6', link: null},
        ]
    }, {
        index: 6, title: '标准层计容面积段', tags: [
            {name: '≤300㎡', link: null},
            {name: '≥800㎡', link: null},
            {name: '300-500㎡', link: null},
            {name: '500-800㎡', link: null},
        ]
    },
]
export const cdnBaseURL = 'https://materials-bay.octiri.com/realstate-assests/'
export const thumbnailDir = 'thumbnail/'
export const imageDIR = 'structure-image/'
export const thumbnailList = [
    {
        index: '01',
        name: 'HD-G(19-33F)-2T4-390',
        thumbnail: 'HD-G(19-33F)-2T4-390-SL.png',
        image: 'HD-G(19-33F)-2T4-390.png',
        dir: '01.HD-G(19-33F)-2T4-390',
        dwg: '01.HD-G(19-33F)-2T4-390.dwg',
        pdf: '02.HD-G(19-33F)-2T4-390.pdf',
    },
    {
        index: '02',
        name: 'HD-G(19-33F)-2T4-430',
        thumbnail: 'HD-G(19-33F)-2T4-430-SL.png',
        image: 'HD-G(19-33F)-2T4-430.png',
        dir: '02.HD-G(19-33F)-2T4-430',
        dwg: '01.HD-G(19-33F)-2T4-430.dwg',
        pdf: '02.HD-G(19-33F)-2T4-430.pdf'
    },
    {
        index: '03',
        name: 'HD-G(19-33F)-2T4-420',
        thumbnail: 'HD-G(19-33F)-2T4-420-SL.png',
        image: 'HD-G(19-33F)-2T4-420.png',
        dir: '03.HD-G(19-33F)-2T4-420',
        dwg: '01.HD-G(19-33F)-2T4-420.dwg',
        pdf: '02.HD-G(19-33F)-2T4-420.pdf'
    },
    {
        index: '04',
        name: 'HD-G(19-33F)-2T4-460',
        thumbnail: 'HD-G(19-33F)-2T4-460-SL.png',
        image: 'HD-G(19-33F)-2T4-460.png',
        dir: '04.HD-G(19-33F)-2T4-460',
        dwg: '01.HD-G(19-33F)-2T4-460.dwg',
        pdf: '02.HD-G(19-33F)-2T4-460.pdf'

    },
    {
        index: '05',
        name: 'HD-G(19-33F)-2T4-470',
        thumbnail: 'HD-G(19-33F)-2T4-470-SL.png',
        image: 'HD-G(19-33F)-2T4-470.png',
        dir: '05.HD-G(19-33F)-2T4-470',
        dwg: '01.HD-G(19-33F)-2T4-470.dwg',
        pdf: '02.HD-G(19-33F)-2T4-470.pdf'
    },
    {
        index: '06',
        name: 'HD-G(19-33F)-2T4-490',
        thumbnail: 'HD-G(19-33F)-2T4-490-SL.png',
        image: 'HD-G(19-33F)-2T4-490.png',
        dir: '06.HD-G(19-33F)-2T4-490',
        dwg: '01.HD-G(19-33F)-2T4-490.dwg',
        pdf: '02.HD-G(19-33F)-2T4-490.pdf'
    },
    {
        index: '07',
        name: 'HD-G(19-33F)-3T6-610',
        thumbnail: 'HD-G(19-33F)-3T6-610-SL.png',
        image: 'HD-G(19-33F)-3T6-610.png',
        dir: '07.HD-G(19-33F)-3T6-610',
        dwg: '01.HD-G(19-33F)-3T6-610.dwg',
        pdf: '02.HD-G(19-33F)-3T6-610.pdf'
    },

]
export {RegionDict};