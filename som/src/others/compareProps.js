function compareProps(currentMetadata, nextMetadata, currentModelFiles, nextModelFiles) {

    //console.log("compareMetadata: ", currentMetadata);
    //console.log("nextMetadata: ", nextMetadata);
    //console.log("nextBriefInfo: ", nextMetadata['BriefInfo']);
    const compareBriefInfo = (currentMetadata.BriefInfo !== nextMetadata.BriefInfo) ? true : false;
    const compareDescription = (currentMetadata.Description !== nextMetadata.Description) ? true : false;
    const compareSource = (currentMetadata.Source !== nextMetadata.Source) ? true : false;
    const compareNumber_of_Instance = (currentMetadata.Number_of_Instance !== nextMetadata.Number_of_Instance) ? true : false;
    const compareNumber_of_Attribute = (currentMetadata.Number_of_Attribute !== nextMetadata.Number_of_Attribute) ? true : false;
    const compareLabel = (currentMetadata.Label !== nextMetadata.Label) ? true : false;

    const compareKeyWords = (currentKeywords, nextKeywords) => {
        // if their lengths are different, meaning keywords got changed, so needs to be updated
        if (currentKeywords.length !== nextKeywords.length) {
            return true;
        }
        else {
            // if some content in those kywords are different, then needs to update
            const result = currentKeywords.map((value, index) => {
                return value !== nextKeywords[index] ? "update" : "noUpdate"
            });

            return result.includes("update");
        }
    };

    const compareAttributes = (currentAttributes, nextAttributes) => {
        if (currentAttributes.length !== nextAttributes.length) {
            return true;
        }
        else {
            const attr_result = currentAttributes.map((eachValue, index) => {
                return Object.values(eachValue).map((eachAttr, attrIndex) => {
                    return eachAttr !== Object.values(nextAttributes[index])[attrIndex] ? "update" : "noUpdate";
                })
            });

            const attr_result_final = attr_result.map(eachResult => {
                return eachResult.includes("update") ? "update" : "noUpdate";
            });

            return attr_result_final.includes("update");
        }
    };

    // compare model files
    const compareModelFiles = (currentModelFiles, nextModelFiles) => {
        if(currentModelFiles.length !== nextModelFiles.length){
            console.log("because of model files");
            return true
        }
        else if (currentModelFiles.length !== 0 && nextModelFiles.length !== 0){
            const BriefInfo_result = currentModelFiles.map((eachModel, index) => {
                return eachModel.BriefInfo === nextModelFiles[index]["BriefInfo"] ? "update" : "noUpdate";
            });

            return BriefInfo_result.includes("update");
        }
    }

    //different matadata's length means the user changed metadata just now, the system needs to be updated
    /** 
    if (currentMetadata.length !== nextMetadata.length) {
        return true;
    }*/
    // different content of metadata means updating
    if (compareBriefInfo || compareDescription || compareSource || compareNumber_of_Instance ||
        compareNumber_of_Attribute || compareLabel || compareKeyWords(currentMetadata.Keywords, nextMetadata.Keywords) ||
        compareAttributes(currentMetadata.AttrInfo, nextMetadata.AttrInfo)|| compareModelFiles(currentModelFiles, nextModelFiles)) {
        return true
    }
    // no different content of metadata means no updating
    else {
        return false;
    }
}

export default compareProps;