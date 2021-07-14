const multilineCommentRegex = /\/\*[\s\S]*\*\//g;
const htmlCommentRegex = /<!--[\s\S]*-->/g;

function removeMultilineComments(text){
	return text.replace(multilineCommentRegex, "");
};

function removeHTMLComments(text){
	return text.replace(htmlCommentRegex, "");
};

module.exports = {
	removeMultilineComments,
	removeHTMLComments,
};
