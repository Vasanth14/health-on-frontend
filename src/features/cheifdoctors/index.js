import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../common/headerSlice";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";
import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import SearchBar from "../../components/Input/SearchBar";
import axios from "axios";

function CheifDoctors() {
  const [chiefDoctors, setChiefDoctors] = useState([]);
  const [filteredChiefDoctors, setFilteredChiefDoctors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items to display per page

  const TopSideButtons = ({ applySearch }) => {
    const [filterParam, setFilterParam] = useState("");
    const [filterSearchText, setFilterSearchText] = useState("");

    const dispatch = useDispatch();

    const openAddNewLeadModal = () => {
      dispatch(
        openModal({
          title: "Add New Lead",
          bodyType: MODAL_BODY_TYPES.LEAD_ADD_NEW,
        })
      );
    };

    return (
      <div className="inline-block float-right">
        <button
          className="btn px-6 btn-sm normal-case btn-primary"
          onClick={() => openAddNewLeadModal()}
        >
          Add New
        </button>
      </div>
    );

    const removeAppliedFilter = () => {
      removeFilter();
      setFilterParam("");
      setSearchText("");
    };

    useEffect(() => {
      if (searchText === "") {
        removeAppliedFilter();
      } else {
        applySearch(searchText);
      }
    }, [searchText]);

    return (
      <div className="inline-block float-right">
        <SearchBar
          searchText={filterSearchText}
          styleClass="mr-4"
          setSearchText={setFilterSearchText}
        />
        {filterParam !== "" && (
          <button
            onClick={() => removeAppliedFilter()}
            className="btn btn-xs mr-2 btn-active btn-ghost normal-case"
          >
            {filterParam}
            <XMarkIcon className="w-4 ml-2" />
          </button>
        )}
      </div>
    );
  };

  useEffect(() => {
    // Fetch data from the API when component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const hospitalId = localStorage.getItem("hospitalId");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/hospitals/cheifDoctors/${hospitalId}`
      );
      console.log(response.data);
      setChiefDoctors(response.data.results);
      setFilteredChiefDoctors(response.data.results); // Initially set filtered chief doctors same as fetched chief doctors
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const removeFilter = () => {
    setFilteredChiefDoctors(chiefDoctors);
  };

  const applySearch = (value) => {
    const filtered = chiefDoctors.filter(
      (doctor) =>
        doctor.cheifDoctorName.toLowerCase().includes(value.toLowerCase()) ||
        doctor.cheifDoctorEmail.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredChiefDoctors(filtered);
    setSearchText(value);
    setCurrentPage(1); // Reset to the first page when applying search
  };

  const handlePrevButtonClick = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextButtonClick = () => {
    setCurrentPage((prevPage) =>
      Math.min(
        prevPage + 1,
        Math.ceil(filteredChiefDoctors.length / itemsPerPage)
      )
    );
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredChiefDoctors.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredChiefDoctors.length / itemsPerPage);

  return (
    <>
      <TitleCard
        title="Cheif Doctors"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        <div className="inline-block float-right">
          <SearchBar
            searchText={searchText}
            styleClass="mr-4"
            setSearchText={applySearch}
          />
          {searchText !== "" && (
            <button
              onClick={() => {
                applySearch("");
              }}
              className="btn btn-xs mr-2 btn-active btn-ghost normal-case"
            >
              Clear Search
              <XMarkIcon className="w-4 ml-2" />
            </button>
          )}
        </div>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email Id</th>
                <th>Education</th>
                <th>Specialization</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((doctor, index) => (
                <tr key={index}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-circle w-12 h-12">
                          <img src={doctor.profilePicture} alt="Avatar" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">
                          {doctor.cheifDoctorName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{doctor.cheifDoctorEmail}</td>
                  <td>{doctor.educationQualifications}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.availability}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="join inline-block float-right">
            <button
              className="join-item btn btn-outline"
              onClick={handlePrevButtonClick}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="join-item btn btn-outline"
              onClick={handleNextButtonClick}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </TitleCard>
    </>
  );
}

export default CheifDoctors;
