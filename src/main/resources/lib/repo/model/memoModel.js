exports.toJson = function toJson(memo) {
    if (memo) {
        return {
            title: memo.title,
            description: memo.description,
            url: memo.url,
            volumeData: memo.volumeData,
            time: memo.time,
            modifiedTime: memo.modifiedTime,
            transcript: memo.transcript
        }
    }

    return {};
}