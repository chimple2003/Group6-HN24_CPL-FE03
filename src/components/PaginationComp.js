import React, { useEffect, useMemo } from "react";
import { Pagination } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTopicListStore } from "../stores/topic";

const PaginationComp = ({ activeKey }) => {
  const navigate = useNavigate();
  const {
    total = 0,
    fetchTopicList,
    allTopics,
    itemsPerPage,
  } = useTopicListStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Handle page change
  const handlePageChange = (e, newPage, disabled) => {
    if (disabled) return;

    // Update URL search params
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);

    // If topics not fetched, fetch them
    if (allTopics.length === 0) {
      fetchTopicList({
        page: newPage,
        tag: activeKey === "all" ? "" : activeKey,
      });
    }
  };

  // Fetch topics on initial load or when active key changes
  useEffect(() => {
    if (allTopics.length === 0) {
      fetchTopicList({
        page: currentPage,
        tag: activeKey === "all" ? "" : activeKey,
      });
    }
  }, [activeKey]);

  // Generate pagination items
  const pageList = useMemo(() => {
    const totalPage = Math.ceil(total / itemsPerPage);
    if (totalPage <= 1) return [];

    const createPageItem = (page, isActive = false) => (
      <Pagination.Item
        key={`page-${page}`}
        active={isActive}
        onClick={(e) => handlePageChange(e, page)}
      >
        {page}
      </Pagination.Item>
    );

    const items = [];
    items.push(
      <Pagination.First
        key="first"
        disabled={currentPage === 1}
        onClick={(e) => handlePageChange(e, 1)}
      />
    );
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={(e) => handlePageChange(e, currentPage - 1)}
      />
    );

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPage, currentPage + 2);

    if (start > 1) items.push(createPageItem(1));
    if (start > 2) items.push(<Pagination.Ellipsis key="start-ellipsis" />);

    for (let i = start; i <= end; i++) {
      items.push(createPageItem(i, i === currentPage));
    }

    if (end < totalPage - 1)
      items.push(<Pagination.Ellipsis key="end-ellipsis" />);
    if (end < totalPage) items.push(createPageItem(totalPage));

    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPage}
        onClick={(e) => handlePageChange(e, currentPage + 1)}
      />
    );
    items.push(
      <Pagination.Last
        key="last"
        disabled={currentPage === totalPage}
        onClick={(e) => handlePageChange(e, totalPage)}
      />
    );

    return items;
  }, [total, currentPage, allTopics]);

  return <Pagination>{pageList}</Pagination>;
};

export default PaginationComp;
