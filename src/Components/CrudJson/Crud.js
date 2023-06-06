import React, { useEffect, useState } from "react";
import axios from "axios";

function Crud() {
  const [data, setData] = useState([]);
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
  });
  const [editingId, setEditingId] = useState(null); // State to track the item being edited
  const [search, setSearch] = useState("");
  const [filterdata, setfilterdata] = useState("");
  const FilterOption = ["name", "email"];
  //pagination
  const [currentPage, setCurrentpage] = useState(1);
  const recordsperpage = 5;
  const lastIndex = currentPage * recordsperpage;
  const firstIndex = lastIndex - recordsperpage;
  const records = data.slice(firstIndex, lastIndex);
  const npage = Math.ceil(data.length / recordsperpage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("jhgjhg");
    const response = await axios
      .post("http://localhost:4000/Data", formdata)
      .then((res) => res)
      .catch((err) => err);
    getData();
  };

  const getData = async () => {
    const response = await axios
      .get("http://localhost:4000/Data")
      .then((res) => setData(res.data))
      .catch((err) => err);
  };

  const handleDelete = async (id) => {
    const response = await axios
      .delete(`http://localhost:4000/Data/${id}`)
      .then((res) => res)
      .catch((err) => err);
    getData();
  };

  const handleEdit = (id) => {
    setEditingId(id); // Set the editingId state to the selected item id
    const selectedItem = data.find((item) => item.id === id);
    setFormdata({
      name: selectedItem.name,
      email: selectedItem.email,
    });
  };

  const handleSort = (event) => {
    const selectedFilter = event.target.value;
    setfilterdata(selectedFilter);
    setSearch("");

    if (selectedFilter === "name") {
      const sortedData = [...data].sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
      setData(sortedData);
    } else if (selectedFilter === "email") {
      const sortedData = [...data].sort((a, b) =>
        (a.email || "").localeCompare(b.email || "")
      );
      setData(sortedData);
    }
  };

  const handleUpdate = async () => {
    const response = await axios
      .put(`http://localhost:4000/Data/${editingId}`, formdata)
      .then((res) => res)
      .catch((err) => err);
    setEditingId(null);
    getData();
    setFormdata({
      name: "",
      email: "",
    });
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearch(searchValue);

    if (searchValue === "") {
      getData(); // Reset the data to the original dataset
    } else {
      const filteredData = data.filter((item) => {
        const lowerCaseSearchValue = searchValue.toLowerCase();
        const name = item.name ? item.name.toLowerCase() : ""; // Check if name is a string
        const email = item.email ? item.email.toLowerCase() : ""; // Check if email is a string

        return (
          name.includes(lowerCaseSearchValue) ||
          email.includes(lowerCaseSearchValue)
        );
      });
      setData(filteredData);
    }
  };

  const perPage = () => {
    if (currentPage !== 1) {
      setCurrentpage(currentPage - 1);
    }
  };
  const changeCurrentPage = (id) => {
    setCurrentpage(id);
  };
  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentpage(currentPage + 1);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formdata.name}
          onChange={(e) =>
            setFormdata({ ...formdata, [e.target.name]: e.target.value })
          }
        />
        <input
          type="text"
          name="email"
          value={formdata.email}
          onChange={(e) =>
            setFormdata({ ...formdata, [e.target.name]: e.target.value })
          }
        />
        <button type="submit">submit</button>
      </form>
      <select onChange={handleSort} value={filterdata}>
        <option>Filter</option>
        {FilterOption.map((item, index) => (
          <option value={item} key={index}>
            {item}
          </option>
        ))}
      </select>

      <input type="text" name="search" value={search} onChange={handleSearch} />
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records?.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={formdata.name}
                    onChange={(e) =>
                      setFormdata({ ...formdata, name: e.target.value })
                    }
                  />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={formdata.email}
                    onChange={(e) =>
                      setFormdata({ ...formdata, email: e.target.value })
                    }
                  />
                ) : (
                  item.email
                )}
              </td>
              <td>
                {editingId === item.id ? (
                  <button onClick={handleUpdate}>Update</button>
                ) : (
                  <React.Fragment>
                    <button onClick={() => handleEdit(item.id)}>Edit</button>
                    <button onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </React.Fragment>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item">
            <a class="page-link" href="#" onClick={perPage}>
              Previous
            </a>
          </li>
          {numbers.map((n, i) => (
            <li class="page-item" key={i}>
              <a
                class="page-link"
                href="#"
                onClick={() => changeCurrentPage(n)}
              >
                {n}
              </a>
            </li>
          ))}
          <li class="page-item">
            <a class="page-link" href="#" onClick={nextPage}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Crud;
