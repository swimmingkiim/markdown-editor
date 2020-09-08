export const turnIntoTag = (content) => {
  switch (content) {
    case "ul":
      const ul = document.createElement("ul");
      return ul;
    case "ol":
      const ol = document.createElement("ol");
      return ol;
    case "li":
      const li = document.createElement("li");
      return li;
    case "h1":
      const headingOne = document.createElement("h1");
      return headingOne;
    case "h2":
      const headingTwo = document.createElement("h2");
      return headingTwo;
    case "h3":
      const headingThree = document.createElement("h3");
      return headingThree;
    case "h4":
      const headingFour = document.createElement("h4");
      return headingFour;
    case "h5":
      const headingFive = document.createElement("h5");
      return headingFive;
    case "h6":
      const headingSix = document.createElement("h6");
      return headingSix;
    case "__":
      const strong = document.createElement("strong");
      return strong;
    case "_":
      const em = document.createElement("em");
      return em;
    case "~~":
      const del = document.createElement("del");
      return del;
    case "`":
      const mark = document.createElement("mark");
      return mark;
    case "a":
      const a = document.createElement("a");
      return a;
    case "img":
      const img = document.createElement("img");
      return img;
    default:
      return document.createElement("div");
  }
};

const deleteAllPrevText = (editor) => {
  return (editor.innerHTML = "");
};

export const readFileToText = (file, editor) => {
  const reader = new FileReader();

  reader.onload = () => {
    deleteAllPrevText(editor);
    textToHTML(reader.result, editor);
  };
  reader.readAsText(file);
};

export const openTextFile = (e, editor) => {
  let input = document.createElement("input");
  input.type = "file";
  input.accept = "text/markdown";

  input.addEventListener("change", (event) => {
    readFileToText(event.target.files[0], editor);
  });
  input.click();
};

const textToHTML = (text, editor) => {
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("#")) {
      editor.appendChild(turnIntoHeading(lines[i]));
    } else if (getTypeOfList(lines[i]) !== null) {
      const newList = turnIntoTag(getTypeOfList(lines[i]));
      editor.appendChild(newList);
      i = turnIntoList(newList, lines, i);
    } else {
      const div = turnIntoTag("div");
      editor.appendChild(checkLineText(div, lines[i]));
    }
  }
};

const checkLineText = (lineTag, text) => {
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "_") {
      const strong = turnIntoSubTag(text, i, "__");
      if (strong !== null) {
        lineTag.appendChild(strong[0]);
        i = strong[1];
      } else {
        const em = turnIntoSubTag(text, i, "_");
        if (em !== null) {
          lineTag.appendChild(em[0]);
          i = em[1];
        }
      }
    } else if (text[i] === "~") {
      const del = turnIntoSubTag(text, i, "~~");
      if (del !== null) {
        lineTag.appendChild(del[0]);
        i = del[1];
      }
    } else if (text[i] === "`") {
      const mark = turnIntoSubTag(text, i, "`");
      if (mark !== null) {
        lineTag.appendChild(mark[0]);
        i = mark[1];
      }
    } else if (text[i] === "[") {
      if (text.slice(i).match(/\[.+\]\(.+\)/) !== null) {
        const aTag = turnIntoLink(text.slice(i));
        lineTag.appendChild(aTag);
        i += text.slice(i).match(/\[.+\]\(.+\)/)[0].length - 1;
      }
    } else if (text[i] === "!") {
      if (text.slice(i).match(/\!\[.+\]\(.+\)/) !== null) {
        const aTag = turnIntoImage(text.slice(i));
        lineTag.appendChild(aTag);
        i += text.slice(i).match(/\!\[.+\]\(.+\)/)[0].length - 1;
      }
    } else {
      lineTag.lastChild && lineTag.lastChild.nodeType === 3
        ? (lineTag.lastChild.textContent += text[i])
        : lineTag.appendChild(document.createTextNode(text[i]));
    }
  }
  return lineTag;
};

const turnIntoSubTag = (text, index, keyword) => {
  const start = text.slice(index).indexOf(keyword) + index;
  const end = text.slice(start + 1).indexOf(keyword) + start + 1;
  if (start !== end && start >= 0 && end >= 0) {
    const newSubTag = turnIntoTag(keyword);
    newSubTag.innerHTML = text.slice(start + keyword.length, end);
    return [newSubTag, end + keyword.length - 1];
  }
  return null;
};

const turnIntoHeading = (line) => {
  const size = line.lastIndexOf("# ") + 1;
  const newElement = turnIntoTag(`h${size}`);
  return checkLineText(newElement, line.slice(size + 1));
};

const turnIntoLi = (line) => {
  const text = line.replace(/^\*\s|^[1-9]+\.\s|^\s+\*\s|^\s+[1-9]+\.\s/, "");
  const newLi = turnIntoTag("li");
  return checkLineText(newLi, text);
};

const turnIntoLink = (text) => {
  const displayText = text.slice(text.indexOf("[") + 1, text.indexOf("]"));
  const url = text.slice(text.indexOf("(") + 1, text.indexOf(")"));
  const newA = turnIntoTag("a");
  newA.setAttribute("href", url);
  newA.innerHTML = displayText;
  return newA;
};

const turnIntoImage = (text) => {
  const alt = text.slice(text.indexOf("[") + 1, text.indexOf("]"));
  const url = text.slice(text.indexOf("(") + 1, text.indexOf(")"));
  const newImage = turnIntoTag("img");
  newImage.setAttribute("alt", alt);
  newImage.setAttribute("src", url);
  return newImage;
};

const checkForDepthOfList = (line) => {
  if (line.match(/^\*\s|^[1]\.\s|^\s+\*\s|^\s+[1]\.\s/)) {
    const indent = line.match(/^\s+/);
    return indent === null ? 0 : indent[0].length;
  }
  return null;
};

const getTypeOfList = (line) => {
  const isUl = line.match(/^\*\s|^\s+\*\s/);
  const isOl = line.match(/^1\.\s|^\s+1\.\s/);
  if (isUl !== null) return "ul";
  else if (isOl !== null) return "ol";
  else return null;
};

const turnIntoList = (parentElement, lines, index) => {
  if (checkForDepthOfList(lines[index]) === null || index >= lines.length)
    return index - 1;
  const prevDepth = index === 0 ? 0 : checkForDepthOfList(lines[index - 1]);
  const depth = checkForDepthOfList(lines[index]);
  const newLi = turnIntoLi(lines[index]);
  if (prevDepth < depth) {
    const newList = turnIntoTag(getTypeOfList(lines[index]));
    newList.appendChild(newLi);
    parentElement.appendChild(newList);
    return turnIntoList(newList, lines, ++index);
  } else if (prevDepth > depth) {
    parentElement.parentNode.appendChild(newLi);
    return turnIntoList(parentElement.parentNode, lines, ++index);
  } else {
    parentElement.appendChild(newLi);
    return turnIntoList(parentElement, lines, ++index);
  }
};
