const categories = ['All', 'Pothole', 'Broken Streetlight', 'Garbage Not Collected', 'Water Leakage', 'Drainage / Waterlogging', 'Damaged Public Infrastructure', 'Normal Street']
const statuses = ['All', 'Reported', 'Verified', 'Assigned', 'In Progress', 'Resolved']

function ComplaintFilters({ search, onSearch, category, onCategory, status, onStatus }) {
  return <section className="report-filters" aria-label="Filter civic reports"><div className="report-search"><label htmlFor="report-search">Search reports</label><input id="report-search" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search title, location or category" /></div><div className="report-filter-group"><label htmlFor="report-category">Category</label><select id="report-category" value={category} onChange={(event) => onCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></div><div className="report-filter-group"><label htmlFor="report-status">Status</label><select id="report-status" value={status} onChange={(event) => onStatus(event.target.value)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></div></section>
}

export { categories, statuses }
export default ComplaintFilters
