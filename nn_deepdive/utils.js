function lerp(start, stop, amt){
	return amt * (stop - start) + start;
}

function doNf(num, left, right) {
	// console.log(num);
	const neg = num < 0;
	const n = neg ? num.toFixed(right).toString().substring(1) : num.toFixed(right).toString();
	const decimalInd = n.indexOf('.');
	const intPart = decimalInd !== -1 ? n.substring(0, decimalInd) : n;
	let decPart = decimalInd !== -1 ? n.substring(decimalInd + 1) : '';
	let str = neg ? '-' : '';
	if (typeof right !== 'undefined') {
		let decimal = '';
		if (decimalInd !== -1 || right - decPart.length > 0) {
			decimal = '.';
		}
		if (decPart.length > right) {
			decPart = decPart.substring(0, right);
		}
		for (let i = 0; i < left - intPart.length; i++) {
			str += '0';
		}
		str += intPart;
		str += decimal;
		str += decPart;
		for (let j = 0; j < right - decPart.length; j++) {
			str += '0';
		}
		return str;
	} else {
		for (let k = 0; k < Math.max(left - intPart.length, 0); k++) {
			str += '0';
		}
		str += n;
		return str;
	}
}