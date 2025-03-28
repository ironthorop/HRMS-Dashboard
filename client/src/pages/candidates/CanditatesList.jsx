import { useState } from 'react';
import { ChevronDown, MoreVertical, Plus, Upload } from 'lucide-react';

const candidatesData = [
  { id: 1, name: 'James Cooper', email: 'james.cooper@example.com', phone: '(270) 555-0117', position: 'Designer Intern', status: 'New', experience: '0' },
  { id: 2, name: 'Jenny Wilson', email: 'jenny.wilson@example.com', phone: '(270) 555-0118', position: 'Senior UI/UX', status: 'New', experience: '5+' },
  { id: 3, name: 'Guy Hawkins', email: 'guy.hawkins@example.com', phone: '(270) 555-0119', position: 'Human Resource L...', status: 'New', experience: '3+' },
  { id: 4, name: 'Andrea Henry', email: 'andrea.henry@example.com', phone: '(270) 555-0120', position: 'Full Time Developer', status: 'Rejected', experience: '2+' },
];

const CandidateList = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [positionFilter, setPositionFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidates, setCandidates] = useState(candidatesData);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: null,
  });
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);

  // Filter candidates based on status, position, and search query
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesStatus = statusFilter === 'All' || candidate.status === statusFilter;
    const matchesPosition = positionFilter === 'All' || candidate.position === positionFilter;
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPosition && matchesSearch;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewCandidate((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      newCandidate.name &&
      newCandidate.email &&
      newCandidate.phone &&
      newCandidate.position &&
      newCandidate.experience &&
      newCandidate.resume &&
      isDeclarationChecked
    ) {
      setCandidates((prev) => [
        ...prev,
        {
          id: candidates.length + 1,
          ...newCandidate,
          status: 'New',
        },
      ]);
      setNewCandidate({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        resume: null,
      });
      setIsDeclarationChecked(false);
      setIsModalOpen(false);
    } else {
      alert('Please fill all required fields and check the declaration.');
    }
  };

  const updateCandidateStatus = (candidateId, newStatus) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate
      )
    );
  };

  return (
    <div className="flex-1 p-6 bg-[#fff]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          {/* Status Filter */}
          <div className="relative w-40">
            <select
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4B0082] appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">Status</option>
              <option value="New">New</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
          </div>

          {/* Position Filter */}
          <div className="relative w-40">
            <select
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4B0082] appearance-none"
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
            >
              <option value="All">Position</option>
              <option value="Designer Intern">Designer Intern</option>
              <option value="Senior UI/UX">Senior UI/UX</option>
              <option value="Human Resource L...">Human Resource L...</option>
              <option value="Full Time Developer">Full Time Developer</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 px-3 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
          />
          <button
            className="flex items-center bg-[#4B0082] hover:bg-[#4B0082]/90 hover:scale-110 transition duration-200 text-white px-4 py-2 cursor-pointer rounded-full"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full text-white">
          <thead className="bg-[#4B0082]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Sr. No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Candidate Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Experience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCandidates.map((candidate, index) => (
              <tr key={candidate.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{candidate.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.position}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative">
                    <button
                      className="w-full text-black flex items-center justify-between px-3 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4B0082] text-left"
                      onClick={() => {
                        const dropdownId = `status-dropdown-${candidate.id}`;
                        const dropdown = document.getElementById(dropdownId);
                        dropdown.classList.toggle('hidden');
                      }}
                    >
                      {candidate.status}
                      <ChevronDown className="h-4 w-4 ml-2 inline" />
                    </button>
                    <ul
                      id={`status-dropdown-${candidate.id}`}
                      className="absolute z-10 w-full text-black bg-white border border-gray-300 rounded-lg shadow-md hidden"
                    >
                      <li
                        onClick={() => {
                          candidate.status = 'Scheduled';
                          console.log(`Updated status for ${candidate.name}: Scheduled`);
                          document.getElementById(`status-dropdown-${candidate.id}`).classList.add('hidden');
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Scheduled
                      </li>
                      <li
                        onClick={() => {
                          candidate.status = 'Ongoing';
                          console.log(`Updated status for ${candidate.name}: Ongoing`);
                          document.getElementById(`status-dropdown-${candidate.id}`).classList.add('hidden');
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Ongoing
                      </li>
                      <li
                        onClick={() => {
                          candidate.status = 'Selected';
                          console.log(`Updated status for ${candidate.name}: Selected`);
                          document.getElementById(`status-dropdown-${candidate.id}`).classList.add('hidden');
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Selected
                      </li>
                      <li
                        onClick={() => {
                          candidate.status = 'Rejected';
                          console.log(`Updated status for ${candidate.name}: Rejected`);
                          document.getElementById(`status-dropdown-${candidate.id}`).classList.add('hidden');
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Rejected
                      </li>
                    </ul>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.experience}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button>
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding New Candidate */}
      {isModalOpen && (
        <div 
        className="fixed inset-0 flex justify-center items-center z-50 rounded-lg" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
          <div className="bg-white rounded-xl shadow-lg w-1/2">
            <div className="flex justify-between items-center p-4 rounded-t-lg bg-[#4B0082]">
              <h2 className="text-lg font-semibold text-[#ffffff] text-center flex-1">Add New Candidate</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-700">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 p-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name*"
                  className="border border-[#4B0082] p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
                  onChange={handleChange}
                  value={newCandidate.name}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address*"
                  className="border border-[#4B0082] p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
                  onChange={handleChange}
                  value={newCandidate.email}
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number*"
                  className="border border-[#4B0082] p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
                  onChange={handleChange}
                  value={newCandidate.phone}
                  required
                />
                <input
                  type="text"
                  name="position"
                  placeholder="Position*"
                  className="border border-[#4B0082] p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
                  onChange={handleChange}
                  value={newCandidate.position}
                  required
                />
                <input
                  type="text"
                  name="experience"
                  placeholder="Experience*"
                  className="border border-[#4B0082] p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
                  onChange={handleChange}
                  value={newCandidate.experience}
                  required
                />
                <label className="border border-[#4B0082] p-2 rounded-xl flex items-center justify-between cursor-pointer">
                  <span className="text-gray-500">Resume*</span>
                  <div className="flex items-center">
                    <Upload className="h-4 w-4 mr-2 text-gray-500" />
                    <input
                      type="file"
                      name="resume"
                      className="hidden"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </label>
              </div>
              <div className="mt-4 px-2" >
                <label className="flex items-center text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={isDeclarationChecked}
                    onChange={(e) => setIsDeclarationChecked(e.target.checked)}
                    required
                  />
                  I hereby declare that the above information is true to the best of my knowledge and belief
                </label>
              </div>
              <div className="flex justify-center mt-4 p-2">
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-full ${
                    newCandidate.name &&
                    newCandidate.email &&
                    newCandidate.phone &&
                    newCandidate.position &&
                    newCandidate.experience &&
                    newCandidate.resume &&
                    isDeclarationChecked
                      ? 'bg-[#4B0082] text-white hover:bg-[#4B0082]/90'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={
                    !(
                      newCandidate.name &&
                      newCandidate.email &&
                      newCandidate.phone &&
                      newCandidate.position &&
                      newCandidate.experience &&
                      newCandidate.resume &&
                      isDeclarationChecked
                    )
                  }
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateList;