export const saveToFiles = (e, editor) => {
  const filename = "gonggeul.md";
  const newAtag = document.createElement("a");
  newAtag.setAttribute(
    "href",
    `data:text/markdown;charset=utf-8,${encodeURIComponent(
      htmlToMarkdown(editor)
    )}`
  );
  newAtag.setAttribute("download", filename);
  newAtag.style.display = "none";
  document.body.appendChild(newAtag);
  newAtag.click();
  newAtag.remove();
};

const htmlToMarkdown = (editor) => {
  let resultText = "";
  const children = Array.from(editor.childNodes);
  children.forEach((tag, i) => {
    if (
      i > 0 &&
      ["UL", "OL", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "IMG"].includes(
        tag.tagName
      )
    )
      resultText += "\n";
    if (tag.nodeType === 3) {
      resultText += turnIntoMarkdown(tag, "TEXTNODE");
    } else if (tag.tagName === "UL" || tag.tagName === "OL") {
      resultText += listToMarkdown(tag, "");
    } else if (tag.tagName === "IMG" || tag.tagName === "A") {
      const option = {
        href: tag.href ? tag.href : null,
        text: tag.textContent ? tag.textContent : null,
        src: tag.src ? tag.src : null,
        alt: tag.alt ? tag.alt : null,
      };
      resultText += turnIntoMarkdown(tag, tag.tagName, option);
    } else if (tag.tagName.startsWith("H")) {
      resultText += turnIntoMarkdown(tag, tag.tagName);
    } else {
      resultText += turnIntoMarkdown(tag, tag.tagName);
    }
  });
  return resultText;
};

const listToMarkdown = (tag, indent) => {
  let resultText = "";
  const children = Array.from(tag.children);
  children.forEach((subTag) => {
    if (subTag.tagName === "LI") {
      resultText +=
        indent + turnIntoMarkdown(subTag, `${tag.tagName}-LI`) + "\n";
    } else if (subTag.tagName === "UL" || subTag.tagName === "OL") {
      resultText += listToMarkdown(subTag, indent + "  ");
    }
  });
  return resultText;
};

const turnIntoMarkdown = (tag, tagName, option = {}) => {
  let content = "";
  if (tag.childNodes && tag.childNodes.length > 0) {
    Array.from(tag.childNodes).forEach((subTag) => {
      if (subTag.nodeType === 3)
        return (content += turnIntoMarkdown(subTag, "TEXTNODE"));
      const subTagOption = {
        href: subTag.href ? subTag.href : null,
        text: subTag.textContent ? subTag.textContent : null,
        src: subTag.src ? subTag.src : null,
        alt: subTag.alt ? subTag.alt : null,
      };
      content += turnIntoMarkdown(subTag, subTag.tagName, subTagOption);
    });
  }
  if (tagName === "TEXTNODE") content = tag.textContent;
  switch (tagName) {
    case "H1":
      return `# ${content}`;
    case "H2":
      return `## ${content}`;
    case "H3":
      return `### ${content}`;
    case "H4":
      return `#### ${content}`;
    case "H5":
      return `##### ${content}`;
    case "H6":
      return `###### ${content}`;
    case "UL-LI":
      return `* ${content}`;
    case "OL-LI":
      return `1. ${content}`;
    case "STRONG":
      return `__${content}__`;
    case "EM":
      return `_${content}_`;
    case "DEL":
      return `~~${content}~~`;
    case "MARK":
      return `\`${content}\``;
    case "A":
      return `[${option.text}](${option.href})`;
    case "IMG":
      return `![${option.alt}](${option.src})`;
    default:
      return `${content}`;
  }
};
