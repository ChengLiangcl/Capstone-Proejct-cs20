const metadata = [
  {
    "FileName": "ex.csv",
    "UserName": "12795757",
    "BriefInfo": "",
    "Description": "This is a detailed description for the dataset",
    "Source": "from...",
    "Number_of_Instance": '1000',
    "Number_of_Attribute": '4',
    "Label": "No",
    "KeyWords": ["a", "b", "c"],
    "AttrInfo": [
      {
        "attrName": "",
        "attrDescription": ""
      },
      {
        "attrName": "",
        "attrDescription": ""
      }
    ]
  }
];

console.log(metadata[0].FileName);

const hero1 = {
  name: ''
};
const hero2 = {
  name: 'Batman'
};

const answer = (hero1.name !== hero2.name) ? true : false;
console.log(hero1.name.length);

arr1 = ["one", "two", "three"];
arr2 = ["one", "two", "three"];

const result = arr1.map((value, index) => {
  return value !== arr2[index] ? "update" : "noUpdate"
});

// console.log(result.includes("update"));


// true => update
// false => not update
const compareKeyWords = (currentKeywords, nextKeywords) => {
  if (currentKeywords.length !== nextKeywords.length) {
    return true;
  }
  else {
    const result = currentKeywords.map((value, index) => {
      return value !== nextKeywords[index] ? "update" : "noUpdate"
    });

    return result.includes("update");
  }
};

//console.log(compareKeyWords(arr1, arr2));

const attr1 = [
  {
    "attrName": "attr1",
    "attrDescription": "descrition for attr1"
  },
  {
    "attrName": "attr2",
    "attrDescription": "descrition for attr1"
  },
  {
    "attrName": "attr3",
    "attrDescription": "descrition for attr3"
  },
  {
    "attrName": "attr4",
    "attrDescription": "descrition for attr4"
  }
];

const attr2 = [
  {
    "attrName": "attr1",
    "attrDescription": "descrition for attr1"
  },
  {
    "attrName": "attr2",
    "attrDescription": "descrition for attr1"
  },
  {
    "attrName": "attr3",
    "attrDescription": "descrition for attr3"
  },
  {
    "attrName": "attr4",
    "attrDescription": "descrition for attr5"
  }
];

const attr_result = attr1.map((eachValue, index) => {
  return Object.values(eachValue).map((eachAttr, attrIndex) => {
    return eachAttr !== Object.values(attr2[index])[attrIndex] ? "update" : "noUpdate";
  })
});

const att_result = attr_result.map(eachResult => {
  return eachResult.includes("update") ? "update" : "noUpdate";
});

//console.log(att_result.includes("update"));


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
}

//console.log("hello" + compareAttributes(attr1, attr2));