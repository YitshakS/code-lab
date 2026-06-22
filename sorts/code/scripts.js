"use strict"; //JS 1.0 -> Ecmascript 1.0 -> ES7.0 -> ES.Next(8.0) | ES5 | ES6

// הפעלת/חסימת אלמנט
function disableElem(elemId, disabled) {
  document.getElementById(elemId).disabled = disabled;
}

// יצירת מערך
/*
ניתן להגדיר צבעים, כמות תאים וכן לקבוע ערכים באופן ידני או רנדומלי
לאחר לחיצה על כפתור "צור מערך" האפשרויות הללו נחסמות
ונפתחות אפשרות בחירת סוג המיון ומהירות הצגתו
input המערך עשוי מתאי
*/
function makeArr() {
  // חסימת הגדרות מאפייני מערך ופתיחת הגדרות מאפייני מיון
  disableElem("fieldset1", true);
  disableElem("fieldset2", false);

  // חסימת כפתור צור מערך ופתיחת כפתור מיין
  document.getElementById("btnCreateArray").className = "button";
  document.getElementById("btnSort").className = "button aqua";

  document.getElementById("startExplanation").className = "fadeOut"; // הסתרת הסבר כללי
  document.getElementById("labelOriginal").style.display = "block"; // הצגת המערך המקורי

  let arr = [];
  let arrSize = Number(document.getElementById("inputsNum").value);
  let arrElem = document.getElementById("arrOriginal");
  let color = document.getElementById("inputsColor2").value; // צבע הגופן
  let backgroundColor = document.getElementById("inputsColor1").value;

  for (let i = 0; i < arrSize; i++) {
    let input = document.createElement("input"); // input כל תא מוגדר בשדה טקסט מסוג 
    input.className = "cell";
    input.style.color = color; // צבע גופן
    input.style.backgroundColor = backgroundColor; // צבע רקע
    input.type = "number"; // הקלט מסוג מספר

    //input.onchange = 
    input.onkeyup = function () { this.style.width = ((this.value.length + 3) * 8) + "px"; }; // שינוי אוטומטי של רוחב התא בהתאם להגדלת/הקטנת הערך ע"י החיצים או בהקלדה

    if (document.getElementById("random").checked) {
      let min = Number(document.getElementById("min").value); // ערך מינימלי להגרלה
      let max = Number(document.getElementById("max").value); // ערך מקסימלי להגרלה
      let point = Number(document.getElementById("point").value); // כמות ספרות אחרי הנקודה להגרלה
      let value = Number((Math.random() * (max - min) + min).toFixed(point)); // הגרלת ערך
      input.value = value;
      //	input.style.width = ((max.toString().length + point + 3) * 8).toString() + "px"; // כל התאים ברוחב זהה - רוחב הערך המקסימלי האפשרי
    }

    input.style.width = ((input.value.length + 3) * 8) + "px"; // רוחב כל תא בהתאם לתכנו
    arrElem.appendChild(input); // html הצגת התא בדף ה
    arr.push(input);
  }
}

// הצגת הסבר של כל מיון
let selectSort = "bubble";

function sortExplanation() {

  if (selectSort != "newAnimation" && selectSort != "oldAnimation")
    document.getElementById(selectSort + "Explanation").className = "fadeOut";		

  selectSort = document.getElementById("selectSort").value;
    document.getElementById(selectSort + "Explanation").className = "fadeIn";
}

// בחירת מיון
let speed; // מהירות המיון
function sort() {

  // חסימת הגדרות מאפייני מיון
  disableElem("fieldset2", true);

  // חסימת כפתור מיין
  document.getElementById("btnSort").className = "button";

  // ה 30 * כי האמצע של הסקלה זה 50 ו 1500 = 50 * 30
  // האנימציה מוצגת במהירות נוחה לצפיה כשהיא מכוונת על 1500 שזה שניה וחצי
  speed = (100 - Number(document.getElementById("speed").value)) * 30;

  let selectSort = document.getElementById("selectSort").value;

  switch (selectSort) {
    case "bubble": bubbleSort(); break;
    case "selection": selectionSort(); break;
    case "insertion": insertionSort(); break;
    case "merge": mergeSort(); break;
    case "quick": quickSort(); break;
    case "all":
      bubbleSort();
      selectionSort();
      insertionSort();
      mergeSort();
      quickSort();
      break;
    default:
      break;
  }
}

// input העתקת תאי ה
function copyInputs(arrDstId) {
  let arrSrc = document.getElementById("arrOriginal").getElementsByTagName("input"); // המקוריים input יצירת מערך מתאי ה
  let arrDst = document.getElementById(arrDstId);
  let color = document.getElementById("inputsColor2").value;
  let backgroundColor = document.getElementById("inputsColor1").value;
  for (let i = 0; i < arrSrc.length; i++) {
    let input = document.createElement("input");
    input.className = "cell";
    input.style.color = color;
    input.style.backgroundColor = backgroundColor;
    input.type = "number";
    input.value = arrSrc[i].value;
    input.style.width = ((input.value.toString().length + 3) * 8).toString() + "px"; //TODO: Check for duplicate code
    input.onchange = input.onkeyup = function () { this.style.width = ((this.value.length + 3) * 8) + "px";}; //TODO: Check for duplicate code
    arrDst.appendChild(input);
  }
}

// מיון בועות
function bubbleSort() {
  
// הגדרת מונה השוואות
//	compCount.style.display = "inline-block";
//	compCount.parentNode.insertBefore (document.createTextNode("מיון בועות"), compCount);
//	compCount.parentNode.insertBefore (document.createElement("br"), compCount);
//	compCount.parentNode.insertBefore (document.createTextNode("השוואות: "), compCount);

// הגדרת מונה החלפות
//	swapCount.style.display = "inline-block";
//	swapCount.parentNode.insertBefore (document.createTextNode("החלפות: "), swapCount);

  document.getElementById("labelBubble").style.display = "block"; // הצגת שם המיון ומונים
  let compCount = document.getElementById("compBubble"); // מונה השוואות
  let swapCount = document.getElementById("swapBubble"); // מונה החלפות
  copyInputs("arrBubble"); // המקוריים למיון הנוכחי input העתקת תאי ה
  let arrInputs = document.getElementById("arrBubble").getElementsByTagName("input"); // שהועתקו input יצירת מערך מתאי ה

  // יצירת מערך של ערכים בלבד
  let arr = [];
  for (let i = 0; i < arrInputs.length; i++)
    arr[i] = Number(arrInputs[i].value);

  let arrow = makeAarrow("arrBubble"); // יצירת חץ

  let steps = 0; // תזמון צעדי אנימציות

  // מיון
  let n, lastSwapIndex, i, tmp;
  for (n = arr.length - 1; n != 0; n = lastSwapIndex) {
    setTimeout(function (n) { moveArrow(arrow, arrInputs[n]); }, steps++ * speed, n); // אנימציית חץ
    for (i = 0, lastSwapIndex = 0; i < n; i++) {
      setTimeout(function (i) { compareAnimation(arrInputs[i], arrInputs[i + 1], compCount); }, steps++ * speed, i); // אנימציית השוואה
      if (arr[i] > arr[i + 1])
      {
        setTimeout(function (i) { swapAnimation(arrInputs[i], arrInputs[i + 1], swapCount); }, steps++ * speed, i); // אנימציית החלפה
        tmp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = tmp;
        lastSwapIndex = i;
      }
    }
  }

  setTimeout(function () { removeArrow(arrow, "endBubble"); }, steps * speed); // הסרת חץ
}

// מיון בחירה
function selectionSort() {

  document.getElementById("labelSelection").style.display = "block"; // הצגת שם המיון ומונים
  let compCount = document.getElementById("compSelection"); // מונה השוואות
  let swapCount = document.getElementById("swapSelection"); // מונה החלפות
  copyInputs("arrSelection"); // המקוריים למיון הנוכחי input העתקת תאי ה
  let arrInputs = document.getElementById("arrSelection").getElementsByTagName("input"); // שהועתקו input יצירת מערך מתאי ה

  // יצירת מערך של ערכים בלבד
  let arr = [];
  for (let i = 0; i < arrInputs.length; i++)
    arr[i] = Number(arrInputs[i].value);

  let arrow = makeAarrow("arrSelection"); // יצירת חץ

  let steps = 0; // תזמון צעדי אנימציות

  // מיון
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;
    setTimeout(function () { moveArrow(arrow, arrInputs[i]); }, steps++ * speed); // אנימציית חץ
    for (let j = i + 1; j < arr.length; j++) {

      setTimeout(function (j, min) { compareAnimation(arrInputs[j], arrInputs[min], compCount); }, steps++ * speed, j, min); // אנימציה של השוואה
      if (arr[j] < arr[min])
        min = j;
    }
    if (i != min) {
      setTimeout(function (i, min) { swapAnimation(arrInputs[i], arrInputs[min], swapCount); }, steps++ * speed, i, min); // אנימציה של החלפה
      let tmp = arr[i];
      arr[i] = arr[min];
      arr[min] = tmp;
    }
  }

  setTimeout(function () { removeArrow(arrow, "endSelection"); }, steps * speed); // הסרת חץ
}

// מיון הכנסה
function insertionSort() {

  document.getElementById("labelInsertion").style.display = "block"; // הצגת שם המיון ומונים
  let compCount = document.getElementById("compInsertion"); // מונה השוואות
  let swapCount = document.getElementById("swapInsertion"); // מונה החלפות
  copyInputs("arrInsertion"); // המקוריים למיון הנוכחי input העתקת תאי ה
  let arrInputs = document.getElementById("arrInsertion").getElementsByTagName("input"); // שהועתקו input יצירת מערך מתאי ה

  // יצירת מערך של ערכים בלבד
  let arr = [];
  for (let i = 0; i < arrInputs.length; i++)
    arr[i] = Number(arrInputs[i].value);

  let arrow = makeAarrow("arrInsertion"); // יצירת חץ

  let steps = 0; // תזמון צעדי אנימציות

  // מיון
  for (let i = 1; i < arr.length; i++) {
    setTimeout(function () { moveArrow(arrow, arrInputs[i]); }, steps++ * speed); // הצגת חץ
    for (let j = i - 1; j >= 0; j--) {
      setTimeout(function () { compareAnimation(arrInputs[j], arrInputs[j + 1], compCount); }, steps++ * speed); // אנימציית השוואה
      if (arr[j] > arr[j + 1]) {
        setTimeout(function () { swapAnimation(arrInputs[j], arrInputs[j + 1], swapCount); }, steps++ * speed); // אנימציית החלפה
        let tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
      }
      else
        break;
    }
  }

  setTimeout(function () { removeArrow(arrow, "endInsertion"); }, steps * speed); // הסרת חץ
}

// מיון מיזוג
function mergeSort() {

  document.getElementById("labelMerge").style.display = "block"; // הצגת שם המיון ומונים
  let compCount = document.getElementById("compMerge"); // מונה השוואות
  let swapCount = document.getElementById("swapMerge"); // מונה החלפות
  copyInputs("arrMerge"); // המקוריים למיון הנוכחי input העתקת תאי ה
  let arrInputs = document.getElementById("arrMerge").getElementsByTagName("input"); // שהועתקו input יצירת מערך מתאי ה

  // יצירת מערך של ערכים בלבד
  let arr = [];
  for (let i = 0; i < arrInputs.length; i++)
    arr[i] = Number(arrInputs[i].value);
  
  let arrow = makeAarrow("arrMerge"); // יצירת חץ
  arrow.style.display = "none";

  Mergesort.sort(arr, 0, arr.length, compCount, swapCount, arrInputs, arrow); // מיון
  
//	setTimeout(function () { moveArrow(arrow, arrInputs[ ]); }, stepsMerge++ * speed); // אנימציית חץ
  setTimeout(function () { removeArrow(arrow, "endMerge"); }, stepsMerge * speed); // הסרת חץ
}

let stepsMerge = 0; // תזמון צעדי אנימציות

let Mergesort = (function () {

  // A in-placed version based on:
  // Jyrki Katajainen, Tomi Pasanen, Jukka Teuhola. ``Practical in-place mergesort''. Nordic Journal of Computing, 1996.
  function swapMerge (xs, i, j, compCount, swapCount, arrInputs, arrow) {
    
    if (i != j) {
      setTimeout (function (i, j) { swapAnimation(arrInputs[i], arrInputs[j], swapCount); }, stepsMerge++ * speed, i, j); // אנימציית החלפה
    }
    let tmp = xs[i];
    xs[i] = xs[j];
    xs[j] = tmp;
  }

  // merge two sorted subs xs[i, m) and xs[j...n) to working area xs[w...]
  function wmerge(xs, i, m, j, n, w, compCount, swapCount, arrInputs, arrow) {
    while (i < m && j < n) {
      setTimeout(function (i, j) { compareAnimation(arrInputs[i], arrInputs[j], compCount); }, stepsMerge++ * speed, i, j); // אנימציית השוואה
      swapMerge(xs, w++, xs[i] < xs[j] ? i++ : j++, compCount, swapCount, arrInputs, arrow);
    }
    while (i < m) {
      swapMerge(xs, w++, i++, compCount, swapCount, arrInputs, arrow);
    }
    while (j < n) {
      swapMerge(xs, w++, j++, compCount, swapCount, arrInputs, arrow);
    }
  }

  // sort xs[l, u), and put result to working area w.
  // constraint, len(w) == u - l
  function wsort(xs, l, u, w, compCount, swapCount, arrInputs, arrow) {
    let m;
    if (u - l > 1) {
      m = l + Math.trunc((u - l) / 2);
      imsort(xs, l, m, compCount, swapCount, arrInputs, arrow);
      imsort(xs, m, u, compCount, swapCount, arrInputs, arrow);
      wmerge(xs, l, m, m, u, w, compCount, swapCount, arrInputs, arrow);
    }
    else
      while (l < u) {
        swapMerge(xs, l++, w++, compCount, swapCount, arrInputs, arrow);
      }
  }

  function imsort(xs, l, u, compCount, swapCount, arrInputs, arrow) {
    let m, n, w;
    if (u - l > 1) {
      m = l + Math.trunc((u - l) / 2);
      w = l + u - m;
      wsort(xs, l, m, w, compCount, swapCount, arrInputs, arrow); // the last half contains sorted elements
      while (w - l > 2) {
        n = w;
        w = l + Math.trunc((n - l + 1) / 2);
        wsort(xs, w, n, l, compCount, swapCount, arrInputs, arrow); // the first half of the previous working area contains sorted elements
        wmerge(xs, l, l + n - w, n, u, w, compCount, swapCount, arrInputs, arrow);
      }
      for (n = w; n > l; --n) // switch to insertion sort
      {
        for (m = n; m < u
          &&
          setTimeout(function (m) { compareAnimation(arrInputs[m], arrInputs[m - 1], compCount); }, stepsMerge++ * speed, m) // אנימציית השוואה
          &&
          xs[m] < xs[m - 1]; ++m) {
          swapMerge(xs, m, m - 1, compCount, swapCount, arrInputs, arrow);
        }
      }
    }
  }

  return {
    sort: imsort
  };

})();

// מיון מהיר
function quickSort() {

  document.getElementById("labelQuick").style.display = "block"; // הצגת שם המיון ומונים
  let compCount = document.getElementById("compQuick"); // מונה השוואות
  let swapCount = document.getElementById("swapQuick"); // מונה החלפות
  copyInputs("arrQuick"); // המקוריים למיון הנוכחי input העתקת תאי ה
  let arrInputs = document.getElementById("arrQuick").getElementsByTagName("input"); // שהועתקו input יצירת מערך מתאי ה

  // יצירת מערך של ערכים בלבד
  let arr = [];
  for (let i = 0; i < arrInputs.length; i++)
    arr[i] = Number(arrInputs[i].value);

  let arrow = makeAarrow("arrQuick"); // יצירת חץ

  Quicksort.sort(arr, 0, arr.length - 1, compCount, swapCount, arrInputs, arrow); // מיון

  setTimeout(function () { removeArrow(arrow, "endQuick"); }, stepsQuick * speed); // הסרת חץ
}

let stepsQuick = 0; // תזמון צעדי אנימציות

let Quicksort = (function () {

  function partition(arr, left, right, compCount, swapCount, arrInputs, arrow) {
    let i = left - 1;
    let j = right + 1;

    setTimeout(function () { moveArrow(arrow, arrInputs[left]); }, (stepsQuick++) * speed); // אנימציית חץ

    while (true) {
      do {
        i++;
        if (left != i)
          setTimeout(function (left, i) { compareAnimation(arrInputs[left], arrInputs[i], compCount); }, stepsQuick++ * speed, left, i); // אנימציית השוואה
      } while (arr[left] > arr[i]); // pivot = arr[left]

      do {
        j--;
        if (j != left)
          setTimeout(function (j, left) { compareAnimation(arrInputs[j], arrInputs[left], compCount); }, stepsQuick++ * speed, j, left); // אנימציית השוואה
      } while (arr[j] > arr[left]);

      if (i >= j) {
        //				setTimeout(function() {offArrow (arrInputs[left]);}, (steps++) * speed);
        return j;
      }

      setTimeout(function (i, j) { swapAnimation(arrInputs[i], arrInputs[j], swapCount); }, stepsQuick++ * speed, i, j); // אנימציית החלפה
      let tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
  }

  function quickSort(arr, left, right, compCount, swapCount, arrInputs, arrow) {
    if (left < right) {
      let pivot = partition(arr, left, right, compCount, swapCount, arrInputs, arrow);
      quickSort(arr, left, pivot, compCount, swapCount, arrInputs, arrow);
      quickSort(arr, pivot + 1, right, compCount, swapCount, arrInputs, arrow);
    }
  }

  return {
    sort: quickSort
  };

})();

// יצירת חץ
function makeAarrow(arrId) {
  let arrow = document.createElement("div");
  arrow.className = "arrow";

  //	חץ יותר יפה אך לא נתמך בכל הדפדפנים
  //	arrow.innerHTML = "&#129095;"; // Google Chrome, Mozilla Firefox
  //	arrow.innerHTML = String.fromCodePoint(0x1F847); // אפשר גם כך
  //	arrow.style.fontFamily = "'Wingdings 3'"; // Microsoft Edge, Microsoft Internet Explorer
  //	arrow.innerHTML = "&#xC8;";

  arrow.innerHTML = "&#11015;"; // חץ שחור צר
  //	arrow.innerHTML = "&#x21e9;"; // חץ לבן צר

  arrow.style.color = document.getElementById("inputsColor4").value; // צבע החץ

  document.getElementById(arrId).appendChild(arrow);
  return arrow;
}

// אנימציית הזזת חץ לאלמנט
function moveArrow(arrow, elem) {
  arrow.style.left = elem.offsetLeft + (elem.offsetWidth / 2) - 7 + "px";
  arrow.style.top = elem.offsetTop - 30 + "px";
}

// הסרת חץ והצגת הודעה שהמערך ממוין
function removeArrow(arrow, arrId) {
  //	arrow.innerHTML = "המערך ממוין " + String.fromCodePoint(0x2714);
  //	moveArrow(arrow, arrow.parentNode.childNodes[0]); 
  //	arrow.style.right = "0px";

  arrow.parentNode.removeChild(arrow);
  document.getElementById(arrId).style.display = "inline-block";
}

// אנימציית השוואה בין 2 תאים
function compareAnimation(value1, value2, comp) {
  comp.textContent = Number(comp.textContent) + 1; // הגדלת מונה השוואות
  value1.style.borderColor = value2.style.borderColor = document.getElementById("inputsColor3").value; // צביעת רקע תאים מושווים
  setTimeout(function () { // החזרת הרקע לברירת המחדל
    value1.style.borderColor = value2.style.borderColor = "DarkGray";
  }, speed * 0.99);
}

// אנימציית החלפה בין 2 תאים
function swapAnimation(elem1, elem2, swap) {

  swap.textContent = Number(swap.textContent) + 1; // הגדלת מונה החלפות

  let elem1fromX = 0; // elem1.offsetLeft; // מוצא בפיקסלים משמאל
  let elem1fromY = elem1.offsetTop; // מוצא בפיקסלים מלמעלה
  let elem1from = [elem1fromX, elem1fromY]; // מוצא בפיקסלים

  let elem1toX = elem2.offsetLeft - elem1.offsetLeft; // יעד בפיקסלים משמאל
  if (elem1.offsetWidth != elem2.offsetWidth) elem1toX += (elem2.offsetWidth - elem1.offsetWidth); // במקרה ששני התאים לא באותו אורך
  let elem1toY = elem2.offsetTop; // יעד בפיקסלים מלמעלה
  let elem1to = [elem1toX, elem1toY]; // יעד בפיקסלים

  let elem1height = 25; // גובה הקשת
  let elem1begingingControlPoint = [elem1fromX + 10, elem1fromY - elem1height];
  let elem1endControlPoint = [elem1toX - 10, elem1toY - elem1height];

  let curve1 = new CurveAnimator(elem1from, elem1to, elem1begingingControlPoint, elem1endControlPoint);

  let elem2fromX = 0; // elem2.offsetLeft; // מוצא בפיקסלים משמאל
  let elem2fromY = elem2.offsetTop; // מוצא בפיקסלים מלמעלה
  let elem2from = [elem2fromX, elem2fromY]; // מוצא בפיקסלים

  let elem2toX = elem1.offsetLeft - elem2.offsetLeft; // יעד בפיקסלים משמאל
  //	if (elem1.offsetWidth != elem2.offsetWidth) elem2toX += elem1.offsetWidth - elem2.offsetWidth; // במקרה ששני התאים לא באותו אורך
  let elem2toY = elem1.offsetTop; // יעד בפיקסלים מלמעלה
  let elem2to = [elem2toX, elem2toY]; // יעד בפיקסלים  

  let elem2height = -25; // גובה הקשת
  let elem2begingingControlPoint = [elem2fromX - 10, elem2fromY - elem2height];
  let elem2endControlPoint = [elem2toX + 10, elem2toY - elem2height];

  let curve2 = new CurveAnimator(elem2from, elem2to, elem2begingingControlPoint, elem2endControlPoint);

  let p1 = new Promise((resolve) => {
    curve1.animate(1, function (point) {
      elem1.style.left = point.x + "px";
      elem1.style.top = point.y + "px";
    }, function () {
      resolve();
    });
  });

  let p2 = new Promise((resolve) => {
    curve2.animate(1, function (point) {
      elem2.style.left = point.x + "px";
      elem2.style.top = point.y + "px";
    }, function () {
      resolve();
    });
  });

  Promise.all([p1, p2]).then(() => {

    // החזרת כל תא למקומו
    let style2 = getComputedStyle(elem2);
    let position2 = style2.position;// || "relative";
    elem2.style.position = "initial";

    let style1 = getComputedStyle(elem1);
    let position1 = style1.position;// || "relative";
    elem1.style.position = "initial";

    // האטת תזוזת התאים שבין התאים המוחלפים
    let transition1 = elem1.style.transition; ////////// ?למה זה לא עובד
    let transition2 = elem2.style.transition;
    elem1.style.transition = "all 1s";
    elem2.style.transition = "all 1s";

    // החלפה בין הערכים
    let tmp = elem1.value;
    elem1.value = elem2.value;
    elem2.value = tmp;

    // החלפה בין האורכים
    tmp = elem1.style.width;
    elem1.style.width = elem2.style.width;
    elem2.style.width = tmp;

    elem1.style.transition = transition1; ////////// ?למה זה לא עובד
    elem2.style.transition = transition2;

    //TODO: Should this be set to a class?

    position1 = position2 = "relative";
    elem1.style.position = position1;
    elem2.style.position = position2;

    elem1.style.top = "0";
    elem1.style.left = "0";
    elem2.style.top = "0";
    elem2.style.left = "0";
  });
}

function CurveAnimator(from, to, c1, c2) {
  this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  this.path.setAttribute("d", "M" + from.join(",") + "C" + c1.join(",") + " " + c2.join(",") + " " + to.join(","));
  this.updatePath();
}

CurveAnimator.prototype.animate = function (duration, callback, doneCallback, e1, e2/*, delay */) {

  let curveAnim = this;
  clearInterval(curveAnim.animTimer);
  let startTime = new Date();
  curveAnim.animTimer = window.setInterval(function () {
    let now = new Date();
    let elapsed = (now - startTime) / (speed * 0.99);
    let percent = elapsed / duration;
    // console.log("percent: " + percent + ", elapsed: " + elapsed + ", duration: " + duration);
    if (percent >= 1) {
      percent = 1;
      clearInterval(curveAnim.animTimer);
      if (typeof doneCallback === "function") {
        doneCallback(e1, e2);
      }
    }
    let rotateDegree = 0; // Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI
    callback(curveAnim.pointAt(percent), rotateDegree);
  }, 0); // כמה להמתין בין פרמים. ככל שהמספר גדול יותר יוצגו פחות פרמים
};

CurveAnimator.prototype.pointAt = function (percent) {
  //console.log(this.len);
  return this.path.getPointAtLength(this.len * percent);
};

CurveAnimator.prototype.updatePath = function () {
  this.len = this.path.getTotalLength();
};

document.addEventListener("DOMContentLoaded", function () {
  let arr;

  document.getElementById("btnCreateArray").onclick = function () {
    arr = makeArr();
  };

  document.getElementById("manually").onchange = function () {
    document.getElementById("point").disabled = document.getElementById("min").disabled = document.getElementById("max").disabled = true;
  };

  document.getElementById("random").onchange = function () {
    document.getElementById("point").disabled = document.getElementById("min").disabled = document.getElementById("max").disabled = false;
  };

  document.getElementById("selectSort").onchange = function () {
    sortExplanation();
  };

  document.getElementById("btnSort").onclick = function () {
    sort(arr);
  };

  document.getElementById("btnReload").onclick = function () {
    location.reload();
  };
});
