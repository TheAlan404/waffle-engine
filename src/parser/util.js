const multilineCommentRegex = /\/\*[\s\S]*\*\//g;

function removeMultilineComments(text){
	return text.replace(multilineCommentRegex, "");
};

module.exports = {
	removeMultilineComments,
};
