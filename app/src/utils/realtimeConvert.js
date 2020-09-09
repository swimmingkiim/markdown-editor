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
    case "####":
      const headingFour = document.createElement("h4");
      headingThree.innerHTML = "Title";
      return headingFour;
    case "#####":
      const headingFive = document.createElement("h5");
      headingThree.innerHTML = "Title";
      return headingFive;
    case "######":
      const headingSix = document.createElement("h6");
      headingThree.innerHTML = "Title";
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
    case "[]()":
      const a = document.createElement("a");
      return a;
    case "![]()":
      const img = document.createElement("img");
      return img;
    case "---":
      const hr = document.createElement("hr");
      return hr;
    default:
      return null;
  }
};

export const turnOldtextIntoNewElement = (
  currentElement,
  newElement,
  rawString
) => {
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

export const setCursorToNextChar = (newElement) => {
  const nextCursor = document.createRange();
  newElement.after(" ");
  nextCursor.setStart(newElement.nextSibling, 1);
  nextCursor.collapse(false);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(nextCursor);
};

export const turnTargetIntoSubtag = (currentElement, trimChar) => {
  if (currentElement.textContent.indexOf(trimChar) >= 0) {
    const frontUnderscoreIndex = currentElement.textContent.indexOf(trimChar);
    const backUnderscoreIndex = currentElement.textContent.lastIndexOf(
      trimChar
    );
    if (frontUnderscoreIndex !== backUnderscoreIndex) {
      if (frontUnderscoreIndex + 1 === backUnderscoreIndex) return;
      const newElement = turnIntoTag(trimChar);
      const rawString = currentElement.textContent.slice(
        frontUnderscoreIndex,
        backUnderscoreIndex + trimChar.length
      );
      newElement.innerHTML = rawString.replace(new RegExp(trimChar, "g"), "");
      turnOldtextIntoNewElement(currentElement, newElement, rawString);
    }
  }
};

export const getDisplayTextAndURL = (rawString) => {
  const displayText = rawString.slice(
    rawString.indexOf("[") + 1,
    rawString.indexOf("]")
  );
  const url = rawString.slice(
    rawString.indexOf("(") + 1,
    rawString.indexOf(")")
  );
  return {
    displayText,
    url,
  };
};

export const insertLink = (currentElement, rawString) => {
  const { displayText, url } = getDisplayTextAndURL(rawString);
  const newElement = turnIntoTag("[]()");
  newElement.setAttribute("href", url);
  newElement.setAttribute("contenteditable", "false");
  newElement.setAttribute("target", "_blank");
  newElement.innerHTML = displayText;
  turnOldtextIntoNewElement(currentElement, newElement, rawString);
};

export const insertImage = (currentElement, rawString) => {
  const { displayText, url } = getDisplayTextAndURL(rawString);
  const newElement = turnIntoTag("![]()");
  newElement.setAttribute("src", url);
  newElement.setAttribute("alt", displayText);
  turnOldtextIntoNewElement(currentElement, newElement, rawString);
};

export const turnPrefixIntoTag = (currentElement, rootContainer) => {
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

export const useInputIntoHTML = (e) => {
  const currentElement = window.getSelection().focusNode;
  const typedChar = currentElement.textContent.slice(
    window.getSelection().anchorOffset - 1,
    window.getSelection().anchorOffset
  );
  switch (typedChar) {
    case " ":
      return turnPrefixIntoTag(currentElement, e.target);
    case ")":
      const imageAddressString = currentElement.textContent.match(
        /\!(\[.+\])(\(.+\))/g
      );
      if (imageAddressString)
        return insertImage(currentElement, imageAddressString[0]);
      else {
        const linkAddressString = currentElement.textContent.match(
          /(\[.+\])(\(.+\))/g
        );
        if (linkAddressString)
          return insertLink(currentElement, linkAddressString[0]);
      }
      return;
    case "_":
      if (currentElement.textContent.indexOf("__") >= 0) {
        return turnTargetIntoSubtag(currentElement, "__");
      }
      return turnTargetIntoSubtag(currentElement, "_");
    case "-":
      if (currentElement.textContent.indexOf("---") >= 0) {
        return turnTargetIntoSubtag(currentElement, "---");
      }
      return;
    case "~":
      if (currentElement.textContent.indexOf("~~") >= 0) {
        return turnTargetIntoSubtag(currentElement, "~~");
      }
      return;
    case "`":
      return turnTargetIntoSubtag(currentElement, "`");
    default:
      return;
  }
};
