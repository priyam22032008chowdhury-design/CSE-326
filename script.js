// Book Publishing Workflow System
// Written with basic JavaScript: variables, arrays,
// objects, functions, loops, if/else and localStorage.
// =====================================================

// ---------- 1. DATA (stored in arrays) ----------
var stages = ["Submission", "Editing", "Proofreading", "Cover Design", "Review", "Publication"];

var authors = [];       // each author:     {id, name}
var editors = [];       // each editor:     {id, name, role}
var manuscripts = [];   // each manuscript: {id, title, authorId, editorId, stage, revision, published, comments}
var selectedId = 0;     // id of the manuscript open in the details panel (0 = none)

// ---------- 2. SAVE AND LOAD (localStorage keeps data after refresh) ----------
function saveData() {
  var data = { authors: authors, editors: editors, manuscripts: manuscripts };
  localStorage.setItem("publishingData", JSON.stringify(data));
}

function loadData() {
  var saved = localStorage.getItem("publishingData");
  if (saved != null) {
    var data = JSON.parse(saved);
    authors = data.authors;
    editors = data.editors;
    manuscripts = data.manuscripts;
  } else {
    // first time: put some sample data
    authors = [
      { id: 1, name: "Meera Kapoor" },
      { id: 2, name: "Jonas Weber" }
    ];
    editors = [
      { id: 1, name: "Rohan Mehta", role: "Editor" },
      { id: 2, name: "Lena Fischer", role: "Proofreader" },
      { id: 3, name: "Dev Sharma", role: "Cover Designer" }
    ];
    manuscripts = [
      { id: 1, title: "The Salt Road", authorId: 1, editorId: 1, stage: 0, revision: "In Progress", published: false, comments: [] },
      { id: 2, title: "Quiet Algorithms", authorId: 2, editorId: 1, stage: 1, revision: "Revision Requested", published: false, comments: [] },
      { id: 3, title: "Paper Lanterns", authorId: 1, editorId: 3, stage: 3, revision: "Approved", published: false, comments: [] }
    ];
    saveData();
  }
}

// ---------- 3. SMALL HELPER FUNCTIONS ----------
// Make text safe before putting it inside HTML
function safe(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Give a new id = (biggest id in the list) + 1
function newId(list) {
  var biggest = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i].id > biggest) { biggest = list[i].id; }
  }
  return biggest + 1;
}

function getAuthorName(id) {
  for (var i = 0; i < authors.length; i++) {
    if (authors[i].id == id) { return authors[i].name; }
  }
  return "Unknown";
}

function getEditorName(id) {
  for (var i = 0; i < editors.length; i++) {
    if (editors[i].id == id) { return editors[i].name; }
  }
  return "Unknown";
}

function findManuscript(id) {
  for (var i = 0; i < manuscripts.length; i++) {
    if (manuscripts[i].id == id) { return manuscripts[i]; }
  }
  return null;
}

// Publication status is worked out from the stage, approval and published flag
function getPublicationStatus(m) {
  if (m.published == true) { return "Published"; }
  if (m.stage == 5 && m.revision == "Approved") { return "Ready to Publish"; }
  return "Not Published";
}

// Choose a CSS class (colour) for the revision status
function revisionClass(status) {
  if (status == "Approved") { return "approved"; }
  if (status == "Revision Requested") { return "revision"; }
  return "progress";
}

function today() {
  return new Date().toLocaleDateString();
}

// Add a comment to a manuscript (used by buttons and by the system)
function addLog(m, by, text) {
  m.comments.push({ by: by, text: text, stage: stages[m.stage], date: today() });
}

// ---------- 4. SHOW / HIDE PAGES ----------
function showPage(pageId) {
  var pages = ["pageManuscripts", "pageAuthors", "pageEditors"];
  for (var i = 0; i < pages.length; i++) {
    document.getElementById(pages[i]).style.display = "none";
  }
  document.getElementById(pageId).style.display = "block";
}

// ---------- 5. DISPLAY FUNCTIONS (they build HTML from the arrays) ----------
// Fill the dropdown lists
function fillDropdowns() {
  var a = "";
  for (var i = 0; i < authors.length; i++) {
    a += "<option value='" + authors[i].id + "'>" + safe(authors[i].name) + "</option>";
  }
  document.getElementById("mAuthor").innerHTML = a;

  var e = "";
  for (var j = 0; j < editors.length; j++) {
    e += "<option value='" + editors[j].id + "'>" + safe(editors[j].name) + " (" + editors[j].role + ")</option>";
  }
  document.getElementById("mEditor").innerHTML = e;
  document.getElementById("detailEditor").innerHTML = e;

  // stage filter
  var oldFilter = document.getElementById("stageFilter").value;
  var f = "<option value='all'>All stages</option>";
  for (var k = 0; k < stages.length; k++) {
    f += "<option value='" + k + "'>" + stages[k] + "</option>";
  }
  document.getElementById("stageFilter").innerHTML = f;
  if (oldFilter != "") { document.getElementById("stageFilter").value = oldFilter; }

  // people who can write comments
  var c = "";
  for (var x = 0; x < authors.length; x++) {
    c += "<option>" + safe(authors[x].name) + " (Author)</option>";
  }
  for (var y = 0; y < editors.length; y++) {
    c += "<option>" + safe(editors[y].name) + " (" + editors[y].role + ")</option>";
  }
  document.getElementById("commentBy").innerHTML = c;
}

// Show how many manuscripts are in each stage
function showPipeline() {
  var html = "";
  for (var i = 0; i < stages.length; i++) {
    var count = 0;
    for (var j = 0; j < manuscripts.length; j++) {
      if (manuscripts[j].stage == i) { count++; }
    }
    html += "<div class='step'><b>" + stages[i] + "</b><br>" + count + " manuscript(s)</div>";
  }
  document.getElementById("pipeline").innerHTML = html;
}

// Show the manuscripts table (with search and stage filter)
function showManuscripts() {
  var search = document.getElementById("searchBox").value.toLowerCase();
  var filter = document.getElementById("stageFilter").value;
  var rows = "";

  for (var i = 0; i < manuscripts.length; i++) {
    var m = manuscripts[i];
    var matchSearch = m.title.toLowerCase().indexOf(search) != -1;
    var matchStage = (filter == "all" || filter == "" || m.stage == filter);

    if (matchSearch && matchStage) {
      rows += "<tr>" +
        "<td>" + safe(m.title) + "</td>" +
        "<td>" + safe(getAuthorName(m.authorId)) + "</td>" +
        "<td>" + safe(getEditorName(m.editorId)) + "</td>" +
        "<td>" + stages[m.stage] + "</td>" +
        "<td class='" + revisionClass(m.revision) + "'>" + m.revision + "</td>" +
        "<td>" + getPublicationStatus(m) + "</td>" +
        "<td><button onclick='openDetails(" + m.id + ")'>Open</button></td>" +
        "</tr>";
    }
  }
  if (rows == "") {
    rows = "<tr><td colspan='7'>No manuscripts found.</td></tr>";
  }
  document.getElementById("manuscriptRows").innerHTML = rows;
}

// Show the details panel for the selected manuscript
function showDetails() {
  var m = findManuscript(selectedId);
  if (m == null) {
    document.getElementById("details").style.display = "none";
    return;
  }
  document.getElementById("details").style.display = "block";
  document.getElementById("detailTitle").innerHTML = safe(m.title);
  document.getElementById("detailInfo").innerHTML =
    "Author: <b>" + safe(getAuthorName(m.authorId)) + "</b> | Editor: <b>" + safe(getEditorName(m.editorId)) +
    "</b><br>Revision status: <b class='" + revisionClass(m.revision) + "'>" + m.revision +
    "</b> | Publication: <b>" + getPublicationStatus(m) + "</b>";
  document.getElementById("detailEditor").value = m.editorId;

  // progress bar of stages: done / current / waiting
  var steps = "";
  for (var i = 0; i < stages.length; i++) {
    var cls = "step";
    if (i < m.stage) { cls = "step done"; }
    if (i == m.stage) { cls = "step current"; }
    steps += "<div class='" + cls + "'>" + stages[i] + "</div>";
  }
  document.getElementById("detailSteps").innerHTML = steps;

  // comments (newest first)
  var list = "";
  for (var j = m.comments.length - 1; j >= 0; j--) {
    var c = m.comments[j];
    list += "<div class='comment'><small>" + c.date + " | " + c.stage + " | " + safe(c.by) + "</small><br>" + safe(c.text) + "</div>";
  }
  if (list == "") { list = "<p>No comments yet.</p>"; }
  document.getElementById("commentList").innerHTML = list;
}

// Show authors table
function showAuthors() {
  var rows = "";
  for (var i = 0; i < authors.length; i++) {
    var count = 0;
    for (var j = 0; j < manuscripts.length; j++) {
      if (manuscripts[j].authorId == authors[i].id) { count++; }
    }
    rows += "<tr><td>" + safe(authors[i].name) + "</td><td>" + count + "</td>" +
            "<td><button onclick='deleteAuthor(" + authors[i].id + ")'>Remove</button></td></tr>";
  }
  document.getElementById("authorRows").innerHTML = rows;
}

// Show editors table
function showEditors() {
  var rows = "";
  for (var i = 0; i < editors.length; i++) {
    var count = 0;
    for (var j = 0; j < manuscripts.length; j++) {
      if (manuscripts[j].editorId == editors[i].id) { count++; }
    }
    rows += "<tr><td>" + safe(editors[i].name) + "</td><td>" + editors[i].role + "</td><td>" + count + "</td>" +
            "<td><button onclick='deleteEditor(" + editors[i].id + ")'>Remove</button></td></tr>";
  }
  document.getElementById("editorRows").innerHTML = rows;
}

// Redraw everything
function refreshAll() {
  fillDropdowns();
  showPipeline();
  showManuscripts();
  showDetails();
  showAuthors();
  showEditors();
}

// ---------- 6. MANUSCRIPT ACTIONS ----------
function addManuscript() {
  var title = document.getElementById("mTitle").value.trim();
  if (title == "") { alert("Please enter the book title."); return; }
  if (authors.length == 0 || editors.length == 0) { alert("Add at least one author and one editor first."); return; }

  var m = {
    id: newId(manuscripts),
    title: title,
    authorId: document.getElementById("mAuthor").value,
    editorId: document.getElementById("mEditor").value,
    stage: 0,                    // every manuscript starts at Submission
    revision: "In Progress",
    published: false,
    comments: []
  };
  addLog(m, "System", "Manuscript submitted");
  manuscripts.push(m);
  document.getElementById("mTitle").value = "";
  selectedId = m.id;
  saveData();
  refreshAll();
}

function openDetails(id) {
  selectedId = id;
  showDetails();
  document.getElementById("details").scrollIntoView();
}

function closeDetails() {
  selectedId = 0;
  showDetails();
}

function changeEditor() {
  var m = findManuscript(selectedId);
  m.editorId = document.getElementById("detailEditor").value;
  addLog(m, "System", "Editor changed to " + getEditorName(m.editorId));
  saveData();
  refreshAll();
}

function approveStage() {
  var m = findManuscript(selectedId);
  if (m.published) { alert("Already published."); return; }
  m.revision = "Approved";
  addLog(m, "System", "Approved at " + stages[m.stage]);
  saveData();
  refreshAll();
}

function requestRevision() {
  var m = findManuscript(selectedId);
  if (m.published) { alert("Already published."); return; }
  m.revision = "Revision Requested";
  addLog(m, "System", "Revision requested at " + stages[m.stage]);
  saveData();
  refreshAll();
}

function markRevised() {
  var m = findManuscript(selectedId);
  if (m.revision != "Revision Requested") { alert("No revision was requested."); return; }
  m.revision = "In Progress";
  addLog(m, "System", "Revised version submitted at " + stages[m.stage]);
  saveData();
  refreshAll();
}

// RULE: a manuscript moves forward only after it is Approved
function nextStage() {
  var m = findManuscript(selectedId);
  if (m.stage == 5) { alert("This is already the last stage."); return; }
  if (m.revision != "Approved") { alert("Approve the current stage before moving on."); return; }
  m.stage = m.stage + 1;
  m.revision = "In Progress";   // new stage needs a new approval
  addLog(m, "System", "Moved to " + stages[m.stage]);
  saveData();
  refreshAll();
}

// RULE: publish only at the last stage and after approval
function publishBook() {
  var m = findManuscript(selectedId);
  if (m.stage != 5 || m.revision != "Approved") {
    alert("A book can be published only at the Publication stage after approval.");
    return;
  }
  m.published = true;
  addLog(m, "System", "Book published on " + today());
  saveData();
  refreshAll();
}

function deleteManuscript() {
  if (confirm("Delete this manuscript?") == false) { return; }
  var keep = [];
  for (var i = 0; i < manuscripts.length; i++) {
    if (manuscripts[i].id != selectedId) { keep.push(manuscripts[i]); }
  }
  manuscripts = keep;
  selectedId = 0;
  saveData();
  refreshAll();
}

function addComment() {
  var text = document.getElementById("commentText").value.trim();
  if (text == "") { alert("Please write a comment."); return; }
  var m = findManuscript(selectedId);
  addLog(m, document.getElementById("commentBy").value, text);
  document.getElementById("commentText").value = "";
  saveData();
  refreshAll();
}

// ---------- 7. AUTHOR AND EDITOR ACTIONS ----------
function addAuthor() {
  var name = document.getElementById("authorName").value.trim();
  if (name == "") { alert("Please enter a name."); return; }
  authors.push({ id: newId(authors), name: name });
  document.getElementById("authorName").value = "";
  saveData();
  refreshAll();
}

function addEditor() {
  var name = document.getElementById("editorName").value.trim();
  if (name == "") { alert("Please enter a name."); return; }
  editors.push({ id: newId(editors), name: name, role: document.getElementById("editorRole").value });
  document.getElementById("editorName").value = "";
  saveData();
  refreshAll();
}

function deleteAuthor(id) {
  for (var i = 0; i < manuscripts.length; i++) {
    if (manuscripts[i].authorId == id) { alert("This author has manuscripts and cannot be removed."); return; }
  }
  var keep = [];
  for (var j = 0; j < authors.length; j++) {
    if (authors[j].id != id) { keep.push(authors[j]); }
  }
  authors = keep;
  saveData();
  refreshAll();
}

function deleteEditor(id) {
  for (var i = 0; i < manuscripts.length; i++) {
    if (manuscripts[i].editorId == id) { alert("This editor has manuscripts and cannot be removed."); return; }
  }
  var keep = [];
  for (var j = 0; j < editors.length; j++) {
    if (editors[j].id != id) { keep.push(editors[j]); }
  }
  editors = keep;
  saveData();
  refreshAll();
}

// ---------- 8. START THE APP ----------
loadData();
refreshAll();
