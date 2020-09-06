export const turnIntoTag = (content) => {
  switch (content) {
    case "*":
      const ul = document.createElement("ul");
      const ulLi = document.createElement("li");
      ul.appendChild(ulLi);
      return ul;
    case "1.":
      const ol = document.createElement("ol");
      const olLi = document.createElement("li");
      ol.appendChild(olLi);
      return ol;
    case "#":
      const headingOne = document.createElement("h1");
      headingOne.innerHTML = "Title";
      return headingOne;
    case "##":
      const headingTwo = document.createElement("h2");
      headingTwo.innerHTML = "Title";
      return headingTwo;
    case "###":
      const headingThree = document.createElement("h3");
      headingThree.innerHTML = "Title";
      return headingThree;
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
    case "[]()":
      const a = document.createElement("a");
      return a;
    default:
      return null;
  }
};

export const setCursorToNextChar = (newElement) => {
  const nextCursor = document.createRange();
  newElement.after(" ");
  nextCursor.setStart(newElement.nextSibling, 1);
  nextCursor.collapse(false);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(nextCursor);
};

export const insertEmphasizingTag = (currentElement, trimChar) => {
  if (currentElement.textContent.indexOf(trimChar) >= 0) {
    const frontUnderscoreIndex = currentElement.textContent.indexOf(trimChar);
    const backUnderscoreIndex = currentElement.textContent.lastIndexOf(
      trimChar
    );
    if (frontUnderscoreIndex !== backUnderscoreIndex) {
      if (frontUnderscoreIndex + 1 === backUnderscoreIndex) return;
      const newElement = turnIntoTag(trimChar);
      const oldText = document.createRange();
      oldText.setStart(currentElement, frontUnderscoreIndex);
      oldText.setEnd(currentElement, backUnderscoreIndex + trimChar.length);
      oldText.surroundContents(newElement);
      newElement.textContent = newElement.textContent.replace(
        new RegExp(`[(${trimChar})]`, "g"),
        ""
      );
      setCursorToNextChar(newElement);
    }
  }
};

export const insertLink = (currentElement, rawString) => {
  const displayText = rawString.slice(
    rawString.indexOf("[") + 1,
    rawString.indexOf("]")
  );
  const url = rawString.slice(
    rawString.indexOf("(") + 1,
    rawString.indexOf(")")
  );
  const newElement = turnIntoTag("[]()");
  newElement.setAttribute("href", url);
  newElement.setAttribute("contenteditable", "false");
  newElement.setAttribute("target", "_blank");
  newElement.innerHTML = displayText;
  const oldText = document.createRange();
  oldText.setStart(
    currentElement,
    currentElement.textContent.indexOf(rawString)
  );
  oldText.setEnd(
    currentElement,
    currentElement.textContent.indexOf(rawString) + rawString.length
  );
  oldText.deleteContents();
  oldText.insertNode(newElement);
  setCursorToNextChar(newElement);
};

export const changeTagType = (currentElement, rootContainer) => {
  const firstWord = currentElement.textContent.slice(
    0,
    currentElement.textContent.indexOf(" ")
  );
  const newElement = turnIntoTag(firstWord);
  if (newElement) {
    if (currentElement.parentNode === rootContainer) {
      rootContainer.insertBefore(newElement, currentElement);
      currentElement.remove();
      return;
    }
    currentElement.parentNode.parentNode.insertBefore(
      newElement,
      currentElement.parentNode
    );
    currentElement.parentNode.remove();
  }
};
