import { useState, useEffect } from 'react';
import { ChevronDown, MoreVertical, Plus, Upload } from 'lucide-react';
import { addCandidate, updateCandidate, deleteCandidate } from "../../services/api";

const CandidateList = () => {
  // State for filters and search
  const [statusFilter, setStatusFilter] = useState('All');
  const [positionFilter, setPositionFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: null,
  });
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);

  // State for candidates and dropdowns
  const [candidates, setCandidates] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);

  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch candidates from the backend
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/candidates`);
        if (!response.ok) {
          throw new Error("Failed to fetch candidates");
        }
        const data = await response.json();
        setCandidates(data.candidates);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Filter candidates based on status, position, and search query
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesStatus = statusFilter === 'All' || candidate.status === statusFilter;
    const matchesPosition = positionFilter === 'All' || candidate.position === positionFilter;
    const matchesSearch =
      candidate?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPosition && matchesSearch;
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload for resume
  const handleFileChange = (e) => {
    setNewCandidate((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  // Handle form submission to add a new candidate
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (
        !newCandidate.name ||
        !newCandidate.email ||
        !newCandidate.phone ||
        !newCandidate.position
      ) {
        alert("Name, email, phone, and position are required fields.");
        return;
      }

      const formData = new FormData();
      formData.append("name", newCandidate.name);
      formData.append("email", newCandidate.email);
      formData.append("phone", newCandidate.phone);
      formData.append("position", newCandidate.position);
      formData.append("experience", newCandidate.experience || 0);
      if (newCandidate.resume) {
        formData.append("resume", newCandidate.resume);
      }

      const response = await addCandidate(formData);
      setCandidates((prev) => [...prev, response.candidate]);
      setNewCandidate({
        name: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        resume: null,
      });
      setIsDeclarationChecked(false);
      setIsModalOpen(false);
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle updating a candidate's status
  const handleUpdateCandidate = async (id, updatedData) => {
    try {
      const response = await updateCandidate(id, updatedData);
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate._id === id ? response.candidate : candidate
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle deleting a candidate
  const handleDeleteCandidate = async (id) => {
    try {
      await deleteCandidate(id);
      setCandidates((prev) => prev.filter((candidate) => candidate._id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle downloading a candidate's resume
  const handleDownloadResume = async (candidateId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/candidates/${candidateId}/download-resume`);
      if (!response.ok) {
        throw new Error("Failed to download resume");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error.message);
    }
  };

  // Toggle dropdown for status in the table
  const toggleDropdown = (dropdownId) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  return (
    <div className="flex-1 p-8 bg-[#f9fafb]">
      {/* Filters and Search */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4">
          {/* Status Filter */}
          <div className="relative w-40">
            <button
              className="w-full flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] text-left bg-white shadow-sm hover:bg-gray-50 transition-all"
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            >
              {statusFilter === 'All' ? 'Status' : statusFilter}
              <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
            </button>
            {statusDropdownOpen && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
                <li
                  onClick={() => {
                    setStatusFilter('All');
                    setStatusDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                >
                  All
                </li>
                <li
                  onClick={() => {
                    setStatusFilter('New');
                    setStatusDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                >
                  New
                </li>
                <li
                  onClick={() => {
                    setStatusFilter('Scheduled');
                    setStatusDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                >
                  Scheduled
                </li>
                <li
                  onClick={() => {
                    setStatusFilter('Ongoing');
                    setStatusDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                >
                  Ongoing
                </li>
                <li
                  onClick={() => {
                    setStatusFilter('Selected');
                    setStatusDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                >
                  Selected
                </li>
                <li
                  onClick={() => {
                    setStatusFilter('Rejected');
                    setStatusDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                >
                  Rejected
                </li>
              </ul>
            )}
          </div>

          {/* Position Filter */}
          <div className="relative w-40">
            <button
              className="w-full flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] text-left bg-white shadow-sm hover:bg-gray-50 transition-all"
              onClick={() => setPositionDropdownOpen(!positionDropdownOpen)}
            >
              {positionFilter === 'All' ? 'Position' : positionFilter}
              <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
            </button>
            {positionDropdownOpen && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
                <li
                  onClick={() => {
                    setPositionFilter('All');
                    setPositionDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                >
                  All
                </li>
                <li
                  onClick={() => {
                    setPositionFilter('Designer Intern');
                    setPositionDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                >
                  Designer Intern
                </li>
                <li
                  onClick={() => {
                    setPositionFilter('Senior UI/UX');
                    setPositionDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                >
                  Senior UI/UX
                </li>
                <li
                  onClick={() => {
                    setPositionFilter('Human Resource Lead');
                    setPositionDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                >
                  Human Resource Lead
                </li>
                <li
                  onClick={() => {
                    setPositionFilter('Full Time Developer');
                    setPositionDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                >
                  Full Time Developer
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Search and Add Candidate Button */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] bg-white shadow-sm transition-all"
          />
          <button
            className="flex items-center bg-[#6A0DAD] hover:bg-[#5A0099] text-white px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Candidate
          </button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && <div className="text-center py-4 text-gray-600">Loading...</div>}
      {error && <div className="text-center py-4 text-red-500">{error}</div>}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full text-gray-700">
            <thead className="bg-[#6A0DAD]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Sr. No.
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Candidate Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCandidates.map((candidate, index) => (
                <tr
                  key={candidate._id}
                  className="hover:bg-gray-50 transition-all"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {candidate.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {candidate.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {candidate.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {candidate.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative">
                      <button
                        className="w-full flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] text-left bg-white shadow-sm"
                        onClick={() =>
                          toggleDropdown(`status-dropdown-${candidate._id}`)
                        }
                      >
                        {candidate.status}
                        <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
                      </button>
                      <ul
                        id={`status-dropdown-${candidate._id}`}
                        className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 hidden"
                      >
                        {["Scheduled", "Ongoing", "Selected", "Rejected"].map(
                          (status) => (
                            <li
                              key={status}
                              onClick={() => {
                                handleUpdateCandidate(candidate._id, {
                                  ...candidate,
                                  status,
                                });
                                toggleDropdown(`status-dropdown-${candidate._id}`);
                              }}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                            >
                              {status}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {candidate.experience}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="relative">
                      <button
                        className="flex items-center px-3 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] bg-white shadow-sm"
                        onClick={() => toggleDropdown(candidate._id)}
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                      <ul
                        className={`absolute z-50 w-40 bg-white border border-gray-200 rounded-lg shadow-lg right-0 mt-1 ${
                          openDropdown === candidate._id ? 'block' : 'hidden'
                        }`}
                      >
                        <li
                          onClick={() => {
                            handleDownloadResume(candidate._id);
                            setOpenDropdown(null);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                        >
                          Download Resume
                        </li>
                        <li
                          onClick={() => {
                            handleDeleteCandidate(candidate._id);
                            setOpenDropdown(null);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                        >
                          Delete Candidate
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Adding New Candidate */}
      {isModalOpen && (
        <div
          className="fixed inset-0  flex justify-center items-center z-50 rounded-lg"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="bg-white rounded-xl shadow-lg w-[50vw] max-w-[50vw]">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 rounded-t-lg bg-[#6A0DAD]">
              <h2 className="text-xl font-semibold text-white text-center flex-1">
                Add New Candidate
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-6 p-6">
                {/* Full Name */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] transition-all"
                    onChange={handleChange}
                    value={newCandidate.name}
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] transition-all"
                    onChange={handleChange}
                    value={newCandidate.email}
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] transition-all"
                    onChange={handleChange}
                    value={newCandidate.phone}
                    required
                  />
                </div>

                {/* Position */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    placeholder="Enter position"
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] transition-all"
                    onChange={handleChange}
                    value={newCandidate.position}
                    required
                  />
                </div>

                {/* Experience */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    placeholder="Enter years of experience"
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] transition-all"
                    onChange={handleChange}
                    value={newCandidate.experience}
                  />
                </div>

                {/* Resume Upload */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Resume <span className="text-red-500">*</span>
                  </label>
                  <label className="border-2 border-dashed border-gray-300 p-3 rounded-lg flex items-center justify-between cursor-pointer hover:border-[#6A0DAD] transition-all">
                    <span className="text-gray-500 truncate">
                      {newCandidate.resume ? newCandidate.resume.name : "Upload resume"}
                    </span>
                    <div className="flex items-center">
                      <Upload className="h-5 w-5 text-gray-500" />
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
              </div>

              {/* Declaration Checkbox */}
              <div className="px-6 pb-4">
                <label className="flex items-center text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 text-[#6A0DAD] focus:ring-[#6A0DAD] border-gray-300 rounded"
                    checked={isDeclarationChecked}
                    onChange={(e) => setIsDeclarationChecked(e.target.checked)}
                    required
                  />
                  <span className="text-sm">
                    I hereby declare that the above information is true to the best of my knowledge and belief
                  </span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-center gap-4 p-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-full ${
                    newCandidate.name &&
                    newCandidate.email &&
                    newCandidate.phone &&
                    newCandidate.position &&
                    newCandidate.resume &&
                    isDeclarationChecked
                      ? 'bg-[#6A0DAD] text-white hover:bg-[#5A0099] transition-all'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={
                    !(
                      newCandidate.name &&
                      newCandidate.email &&
                      newCandidate.phone &&
                      newCandidate.position &&
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