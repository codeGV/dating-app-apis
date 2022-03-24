exports.pager = req=> {
    
        let params = req.query
        let pageNo
        let items
        let skipCount
        if ((params.pageNo != null && params.pageNo != undefined && params.pageNo != "") && (params.items != null && params.items != undefined && params.items != "")) {
            pageNo = Number(params.pageNo) || 1
            items = Number(params.items) || 10
            skipCount = items * (pageNo - 1)
        }
        return {
            pageNo: pageNo,
            items: items,
            skipCount: skipCount
        }
    
}