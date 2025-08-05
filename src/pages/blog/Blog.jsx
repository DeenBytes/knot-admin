import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/reusableComp/Button'
import Pagination from '../../components/reusableComp/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBlog, fetchBlogs, getSingleBlog } from '../../redux/async/blogAsync';
import { toast } from 'react-toastify';
import Popup from '../../hooks/alert';
import { useDebounce } from '../../hooks/useDebounce';
const blogPosts = [
    {
        id: 1,
        title: "The Ultimate Guide to Event Planning in 2025",
        categories: ["Marketing", "Events"],
        publishDate: "July 1, 2025",
        discription: "Discover the latest trends and best practices for event planning in 2025. Discover the latest trends and best practices for event planning in 2025.Discover the latest trends and best practices for event planning in 2025.",
        status: "Published",
        featureUrl: "https://readdy.ai/api/search-image?query=luxury%20nightclub%20VIP%20section%2C%20elegant%20seating%20area%2C%20champagne%20service%2C%20well-dressed%20patrons%2C%20mood%20lighting%2C%20professional%20photography%2C%20high%20quality%2C%20sophisticated%20atmosphere&width=400&height=300&seq=4&orientation=landscape",
        thumbnailUrl: "https://readdy.ai/api/search-image?query=luxury%20nightclub%20VIP%20section%2C%20elegant%20seating%20area%2C%20champagne%20service%2C%20well-dressed%20patrons%2C%20mood%20lighting%2C%20professional%20photography%2C%20high%20quality%2C%20sophisticated%20atmosphere&width=400&height=300&seq=4&orientation=landscape",
        views: 3421,
        actions: ["Edit", "Preview", "Delete"]
    },
    {
        id: 2,
        title: "10 Nightlife Trends Transforming the Club Scene",
        categories: ["Lifestyle", "Entertainment"],
        publishDate: "June 28, 2025",
        discription: "Discover the latest trends and best practices for event planning in 2025.Discover the latest trends and best practices for event planning in 2025.Discover the latest trends and best practices for event planning in 2025.",
        status: "Published",
        featureUrl: "https://readdy.ai/api/search-image?query=luxury%20nightclub%20VIP%20section%2C%20elegant%20seating%20area%2C%20champagne%20service%2C%20well-dressed%20patrons%2C%20mood%20lighting%2C%20professional%20photography%2C%20high%20quality%2C%20sophisticated%20atmosphere&width=400&height=300&seq=4&orientation=landscape",
        thumbnailUrl: "https://readdy.ai/api/search-image?query=luxury%20nightclub%20VIP%20section%2C%20elegant%20seating%20area%2C%20champagne%20service%2C%20well-dressed%20patrons%2C%20mood%20lighting%2C%20professional%20photography%2C%20high%20quality%2C%20sophisticated%20atmosphere&width=400&height=300&seq=4&orientation=landscape",
        views: 2876,
        actions: ["Edit", "Preview", "Delete"]
    },
    {
        id: 3,
        title: "How to Create an Unforgettable VIP Experience",
        categories: ["Business", "Hospitality"],
        publishDate: "July 15, 2025",
        discription: "Discover the latest trends and best practices for event planning in 2025.Discover the latest trends and best practices for event planning in 2025.Discover the latest trends and best practices for event planning in 2025.",
        status: "Published",
        featureUrl: "https://readdy.ai/api/search-image?query=luxury%20nightclub%20VIP%20section%2C%20elegant%20seating%20area%2C%20champagne%20service%2C%20well-dressed%20patrons%2C%20mood%20lighting%2C%20professional%20photography%2C%20high%20quality%2C%20sophisticated%20atmosphere&width=400&height=300&seq=4&orientation=landscape",
        thumbnailUrl: "https://readdy.ai/api/search-image?query=luxury%20nightclub%20VIP%20section%2C%20elegant%20seating%20area%2C%20champagne%20service%2C%20well-dressed%20patrons%2C%20mood%20lighting%2C%20professional%20photography%2C%20high%20quality%2C%20sophisticated%20atmosphere&width=400&height=300&seq=4&orientation=landscape",
        views: null,
        actions: ["Edit", "Preview", "Delete"]
    },
    {
        id: 4,
        title: "Sustainable Practices for Modern Venues",
        categories: ["Sustainability", "Business"],
        publishDate: null,
        discription: "Discover the latest trends and best practices for event planning in 2025.Discover the latest trends and best practices for event planning in 2025.Discover the latest trends and best practices for event planning in 2025.",
        status: "Draft",
        featureUrl: "https://readdy.ai/api/search-image?query=luxury%20nightclub%20VIP%20section%2C%20elegant%20seating%20area%2C%20champagne%20service%2C%20well-dressed%20patrons%2C%20mood%20lighting%2C%20professional%20photography%2C%20high%20quality%2C%20sophisticated%20atmosphere&width=400&height=300&seq=4&orientation=landscape",
        thumbnailUrl: "https://readdy.ai/api/search-image?query=luxury%20nightclub%20VIP%20section%2C%20elegant%20seating%20area%2C%20champagne%20service%2C%20well-dressed%20patrons%2C%20mood%20lighting%2C%20professional%20photography%2C%20high%20quality%2C%20sophisticated%20atmosphere&width=400&height=300&seq=4&orientation=landscape",
        views: null,
        actions: ["Edit", "Preview", "Delete"]
    },
    {
        id: 5,
        title: "The Art of Mixology: Signature Cocktails for Your Venue",
        categories: ["Food & Beverage", "Hospitality"],
        publishDate: "June 15, 2025",
        discription: "Discover the latest trends and best practices for event planning in 2025.Discover the latest trends and best practices for event planning in 2025.Discover the latest trends and best practices for event planning in 2025.",
        status: "Published",
        featureUrl: "https://readdy.ai/api/search-image?query=luxury%20nightclub%20VIP%20section%2C%20elegant%20seating%20area%2C%20champagne%20service%2C%20well-dressed%20patrons%2C%20mood%20lighting%2C%20professional%20photography%2C%20high%20quality%2C%20sophisticated%20atmosphere&width=400&height=300&seq=4&orientation=landscape",
        thumbnailUrl: "https://readdy.ai/api/search-image?query=luxury%20nightclub%20VIP%20section%2C%20elegant%20seating%20area%2C%20champagne%20service%2C%20well-dressed%20patrons%2C%20mood%20lighting%2C%20professional%20photography%2C%20high%20quality%2C%20sophisticated%20atmosphere&width=400&height=300&seq=4&orientation=landscape",
        views: 1954,
        actions: ["Edit", "Preview", "Delete"]
    },
    {
        id: 6,
        title: "Digital Marketing Strategies for Nightlife Venues",
        categories: ["Marketing", "Technology"],
        publishDate: "June 10, 2025",
        discription: "Discover the latest trends and best practices for event planning in 2025.Discover the latest trends and best practices for event planning in 2025.Discover the latest trends and best practices for event planning in 2025.",
        status: "Published",
        featureUrl: "https://readdy.ai/api/search-image?query=luxury%20nightclub%20VIP%20section%2C%20elegant%20seating%20area%2C%20champagne%20service%2C%20well-dressed%20patrons%2C%20mood%20lighting%2C%20professional%20photography%2C%20high%20quality%2C%20sophisticated%20atmosphere&width=400&height=300&seq=4&orientation=landscape",
        thumbnailUrl: "https://readdy.ai/api/search-image?query=luxury%20nightclub%20VIP%20section%2C%20elegant%20seating%20area%2C%20champagne%20service%2C%20well-dressed%20patrons%2C%20mood%20lighting%2C%20professional%20photography%2C%20high%20quality%2C%20sophisticated%20atmosphere&width=400&height=300&seq=4&orientation=landscape",
        views: 2341,
        actions: ["Edit", "Preview", "Delete"]
    },
    {
        id: 7,
        title: "Music Licensing Guide for Event Venues",
        categories: ["Legal", "Business"],
        publishDate: "July 20, 2025",
        discription: "Discover the latest trends and best practices for event planning in 2025.Discover the latest trends and best practices for event planning in 2025.Discover the latest trends and best practices for event planning in 2025.",
        status: "Draft",
        featureUrl: "https://readdy.ai/api/search-image?query=luxury%20nightclub%20VIP%20section%2C%20elegant%20seating%20area%2C%20champagne%20service%2C%20well-dressed%20patrons%2C%20mood%20lighting%2C%20professional%20photography%2C%20high%20quality%2C%20sophisticated%20atmosphere&width=400&height=300&seq=4&orientation=landscape",
        thumbnailUrl: "https://readdy.ai/api/search-image?query=luxury%20nightclub%20VIP%20section%2C%20elegant%20seating%20area%2C%20champagne%20service%2C%20well-dressed%20patrons%2C%20mood%20lighting%2C%20professional%20photography%2C%20high%20quality%2C%20sophisticated%20atmosphere&width=400&height=300&seq=4&orientation=landscape",
        views: null,
        actions: ["Edit", "Preview", "Delete"]
    }
];


const Blog = () => {
    const { blogItems, loading, totalPages, blog } = useSelector(state => state.blog);
    const dispatch = useDispatch();
    const [openDropdownIndex, setOpenDropdownIndex] = React.useState(null);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    //============= Formatting the date =========== \\  
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };


    //=========== useEffect to fetch data =========== \\
    useEffect(() => {
        dispatch(fetchBlogs({ page, limit, search: debouncedSearch, status }));
    }, [dispatch, debouncedSearch, status, page, limit]);

    //=========== function to toggle dropdown =========== \\
    const toggleDropdown = (index) => {
        setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    //========== Function to handle Preview =========== \\
    const handlePreview = async (postId) => {
        setShowModal(true);
        if (!postId) {
            toast.error("No post ID found");
            return;
        }

        try {
            await dispatch(getSingleBlog(postId));
        } catch (err) {
            console.error("Error fetching blog:", err);
            toast.error("Failed to fetch blog");
        }
    };
    //============== Function to delete the blog =========== \\
    const handleDelete = async (id) => {
        const result = await Popup("warning", "Are you sure?", "You won't be able to revert this!");
        if (result.isConfirmed) {
            try {
                const response = await dispatch(deleteBlog(id));

                if (deleteBlog.fulfilled.match(response)) {
                    toast.success(response.payload.message || 'Blog deleted successfully');
                    setPage(1); // Reset to page 1 after deletion
                    dispatch(fetchBlogs({ page: 1, limit }));
                } else {
                    // This is still considered "successful" from a JS point of view, but rejected by thunk
                    toast.error(response.payload?.message || 'Failed to delete the blog');
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Something went wrong');
            }
        }

    }

    return (
        <>
            <div>
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center text-sm text-light mb-2">
                        <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
                        <i className="ri-arrow-right-s-line mx-2 text-xs"></i>
                        <span>Blog</span>
                    </div>
                    <Link to="/blog/add-blog">
                        <Button variant='primary' className="flex items-center cursor-pointer" >
                            <div className="w-4 h-4 flex items-center justify-center mr-2">
                                <i className="ri-add-line"></i>
                            </div>
                            Create New Post
                        </Button>
                    </Link>
                </div>
                {/* <!-- Filters --> */}
                <div className="bg-white dark:bg-secondary border border-info dark:border-inputborder rounded-lg p-4 mb-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="w-full md:w-auto flex-1 md:flex-none">
                            <div className="relative">
                                <select className="bg-transparent dark:bg-inputbg border border-lightborder dark:border-inputborder rounded-lg w-full pl-3 pr-8 py-2 appearance-none" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="All">All Status</option>
                                    <option value={"Published"}>Published</option>
                                    <option value={"Draft"}>Draft</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <div className="w-4 h-4 flex items-center justify-center text-gray-400">
                                        <i className="ri-arrow-down-s-line"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <div className="w-4 h-4 flex items-center justify-center text-gray-400">
                                        <i className="ri-search-line"></i>
                                    </div>
                                </div>
                                <input type="text" className="bg-transparent dark:bg-inputbg border border-lightborder dark:border-inputborder placeholder-light dark:placeholder-lightwhite  rounded-lg w-full pl-10 py-2" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..." />
                            </div>
                        </div>
                    </div>
                </div>
                {loading ? <div className='flex justify-center items-center h-full m-auto '>
                    <i className="ri-loader-2-line text-7xl animate-spin text-primary flex items-center justify-center"></i>
                </div> : <div className="rounded-lg w-full bg-white dark:bg-secondary border border-info dark:border-inputborder">
                    <div className='overflow-x-auto'>
                        <table className="min-w-full text-sm ">
                            <thead>
                                <tr className="text-left text-primary dark:bg-transparent uppercase dark:text-light  text-sm border-b border-lightborder dark:border-inputborder">
                                    <th className="px-6 py-4 font-medium min-w-52">Sr. No</th>
                                    <th className="px-6 py-4 font-medium min-w-52">Title</th>
                                    <th className="px-6 py-4 font-medium min-w-32 ">Feature Image</th>
                                    <th className="px-6 py-4 font-medium min-w-52 ">Description</th>
                                    <th className="px-6 py-4 font-medium min-w-32">Publish Date</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Meta Title</th>
                                    <th className="px-6 py-4 font-medium">Meta Description</th>
                                    <th className="px-6 py-4 font-medium">Meta Keywords</th>
                                    <th className="px-6 py-4 font-medium">Slug</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogItems.map((post, index) => (
                                    <tr key={index} className="border-b border-info dark:border-inputborder hover:bg-foreground dark:hover:bg-[#2d2d2d]/40 transition">
                                        <td className="py-4 px-4 min-w-[100px]">
                                            {(page - 1) * limit + index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <img
                                                    src={post?.featuredImage}
                                                    alt={post?.title}
                                                    className="w-10 h-10 rounded-full mr-2"
                                                />

                                                <div className="font-medium">{post?.title}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><img
                                            src={post?.thumbnailImage}
                                            alt={post?.title}
                                            className="w-10 h-10 rounded-full mr-2"
                                        /></td>
                                        <td className="px-6 py-4">
                                            <div dangerouslySetInnerHTML={{ __html: post?.description.length > 50 ? `${post?.description.slice(0, 50)}...` : post?.description }}></div>
                                        </td>
                                        <td className="px-6 py-4">{formatDate(post?.createdAt) || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-[8px] rounded-[4px] text-[0.75rem] font-medium ${post.status === 'Published' ? 'bg-green-300 text-success' : 'bg-yellow-800/80 text-warning'}`}>
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="px-2 py-4 min-w-[200px]">
                                            {
                                                post?.metaTitle
                                                    ? post.metaTitle.length > 50
                                                        ? `${post.metaTitle.slice(0, 50)}...`
                                                        : post.metaTitle
                                                    : '-'
                                            }
                                        </td>
                                        <td className="px-2 py-4 min-w-[200px]">{
                                            post?.metaDescription
                                                ? post.metaDescription.length > 50
                                                    ? `${post.metaDescription.slice(0, 50)}...`
                                                    : post.metaDescription
                                                : '-'
                                        }</td>
                                        <td className="px-2 py-4 min-w-[200px]">
                                            {
                                                post?.metaKeywords
                                                    ? post.metaKeywords.length > 50
                                                        ? `${post.metaKeywords.slice(0, 50)}...`
                                                        : post.metaKeywords
                                                    : '-'
                                            }
                                        </td>
                                        <td className="px-2 py-4 min-w-[200px]">{post.slug ?? '-'}</td>
                                        <td className="px-6 py-4 text-right relative">
                                            <div className="relative inline-block">
                                                <button
                                                    className="text-gray-400 hover:text-white cursor-pointer"
                                                    onClick={() => toggleDropdown(index)}
                                                >
                                                    <div className="w-5 h-5 flex items-center justify-center">
                                                        <i className="ri-more-2-fill"></i>
                                                    </div>
                                                </button>

                                                {/* Conditionally show the dropdown for current index */}
                                                {openDropdownIndex === index && (
                                                    <div
                                                        className={`absolute ${index >= blogPosts.length - 2 ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-32 bg-white dark:bg-secondary border border-info dark:border-inputborder py-3 shadow-lg rounded-lg z-10`}
                                                    >

                                                        <Link to={`/blog/edit-blog/${post.id}`} className="block px-4 py-2 text-sm hover:bg-extralightgray">
                                                            <div className="flex items-center text-dark dark:text-light">
                                                                <i className="ri-edit-line mr-2"></i>Edit
                                                            </div>
                                                        </Link>
                                                        <div className="block px-4 py-2 text-sm hover:bg-extralightgray" onClick={() => { handlePreview(post.id) }}>
                                                            <div className="flex items-center text-dark dark:text-light cursor-pointer">
                                                                <i className="ri-eye-line mr-2"></i>Preview
                                                            </div>
                                                        </div>
                                                        <div
                                                            onClick={() => handleDelete(post.id)}
                                                            className="block px-4 py-2 cursor-pointer text-sm text-red-400 hover:text-red-300 hover:bg-gray-700"
                                                        >
                                                            <div className="flex items-center text-dark dark:text-light">
                                                                <i className="ri-delete-bin-line mr-2"></i>Delete
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                    <div className="p-4  flex flex-col md:flex-row gap-2 md:gap-0 justify-end items-center">

                        <Pagination totalPages={10} currentPage={page} setCurrentPage={setPage} />
                    </div>
                </div>}

            </div>

            {/* Preview Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
                    <div className="relative bg-white dark:bg-secondary border border-info dark:border-inputborder h-[90vh] rounded-lg w-full max-w-2xl mx-4 flex flex-col overflow-auto hide-scrollbar">

                        <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b border-lightborder dark:border-inputborder bg-white dark:bg-secondary">
                            <h2 className="text-xl text-black dark:text-lightwhite font-medium">Post Preview</h2>
                            <button
                                id="closeModal"
                                className="text-light cursor-pointer hover:text-dark dark:hover:text-white"
                                onClick={() => setShowModal(false)}
                            >
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <i className="ri-close-line text-xl"></i>
                                </div>
                            </button>
                        </div>

                        <div className="space-y-4 p-4">
                            <div>
                                <label className="text-dark dark:text-lightwhite font-medium">Title:</label><br />
                                <div className="font-semibold text-sm text-light">{blog?.title || '-'}</div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-dark dark:text-lightwhite font-medium">Thumbnail:</label><br />
                                    <img src={blog?.thumbnailImage} alt="Thumbnail" className="w-20 h-20 rounded mt-2" />
                                </div>
                                <div>
                                    <label className="text-dark dark:text-lightwhite font-medium">Featured Image:</label><br />
                                    <img src={blog?.featuredImage} alt="Featured" className="w-20 h-20 rounded mt-2" />
                                </div>
                            </div>

                            <div>
                                <label className="text-dark dark:text-lightwhite font-medium">Description:</label>
                                <div
                                    className='text-light mt-2'
                                    dangerouslySetInnerHTML={{
                                        __html: blog?.description || '-',
                                    }}
                                />
                            </div>

                            <div className='text-light'><strong className='text-dark dark:text-lightwhite'>Publish Date:</strong> {blog?.publishDate || '-'}</div>
                            <div>
                                <strong className='text-dark dark:text-lightwhite'>Status:</strong>
                                <span className={`ml-2 px-2 py-1  rounded text-sm font-medium ${blog.status === 'Published' ? 'bg-green-200 text-success' : 'bg-yellow-200 text-yellow-800'}`}>
                                    {blog.status}
                                </span>
                            </div>

                            <div className='text-light'><strong className='text-dark dark:text-lightwhite'>Meta Title :</strong> {blog?.metaTitle || '-'}</div>
                            <div className='text-light'><strong className='text-dark dark:text-lightwhite'>Meta Description :</strong> {blog?.metaDescription || '-'}</div>
                            <div className='text-light'><strong className='text-dark dark:text-lightwhite'>Meta Keywords :</strong> {blog?.metaKeywords || '-'}</div>
                            <div className='text-light'><strong className='text-dark dark:text-lightwhite'>Slug :</strong> {blog?.slug || '-'}</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Blog