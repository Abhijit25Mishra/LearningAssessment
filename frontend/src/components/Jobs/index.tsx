import { useState, useEffect, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { BsSearch, BsStarFill, BsBriefcaseFill } from 'react-icons/bs'
import { MdLocationOn } from 'react-icons/md'
import Header from '../Header'
import { getToken } from '../../utils/token'
import { getUserData } from '../../services/authService'
import './index.css'
import { getJobsList } from '../../services/jobService'

const employmentTypesList = [
    { label: 'Full Time', employmentTypeId: 'Full Time' },
    { label: 'Part Time', employmentTypeId: 'Part Time' },
    { label: 'Freelance', employmentTypeId: 'Freelance' },
    { label: 'Internship', employmentTypeId: 'Internship' },
]

const salaryRangesList = [
    { salaryRangeId: '10', label: '10 LPA and above' },
    { salaryRangeId: '20', label: '20 LPA and above' },
    { salaryRangeId: '30', label: '30 LPA and above' },
    { salaryRangeId: '40', label: '40 LPA and above' },
]

interface Job {
    jobId: string
    title: string
    rating: number
    location: string
    employmentType: string
    packagePerAnnum: string
    jobDescription: string
    companyLogoUrl: string
    roleName: string
    salary: number
    stars: number
}

interface UserProfile {
    name: string
    profileImageUrl: string
    shortBio: string
}

const Jobs = () => {
    const [jobs, setJobs] = useState<Job[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchInput, setSearchInput] = useState('')
    const [activeEmploymentTypes, setActiveEmploymentTypes] = useState<string[]>([])
    const [activeSalaryRange, setActiveSalaryRange] = useState<string>('')
    const [profile, setProfile] = useState<UserProfile | null>(null)

    const [activePage, setActivePage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const pageSize = 10

    useEffect(() => {
        getProfile()
        getJobs()
    }, [])

    useEffect(() => {
        setActivePage(1)
        getJobs()
    }, [activeEmploymentTypes, activeSalaryRange])

    useEffect(() => {
        getJobs()
    }, [activePage])

    const getProfile = async () => {
        try {
            const token = getToken()
            if (token) {
                const data = await getUserData(token)
                setProfile({
                    name: data.name,
                    profileImageUrl: data.avatar_url,
                    shortBio: data.position,
                })
            }
        } catch (error) {
            console.error('Failed to fetch profile', error)
        }
    }

    const getJobs = async () => {
        setIsLoading(true)
        const token = getToken()
        const minimumSalary = activeSalaryRange ? parseInt(activeSalaryRange) : undefined
        const employmentType = activeEmploymentTypes.length > 0 ? activeEmploymentTypes : undefined
        const searchRoleName = searchInput

        try {
            const data = await getJobsList(token, minimumSalary, employmentType, searchRoleName, activePage, pageSize)
            if (data.data) {
                setJobs(data.data)
                setTotalPages(Math.ceil(data.total_count / pageSize))
            } else {
                setJobs([])
                setTotalPages(0)
            }
        } catch (error) {
            console.error('Error fetching jobs', error)
            setJobs([])
            setTotalPages(0)
        }
        setIsLoading(false)
    }

    const onSearchEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setActivePage(1)
            getJobs()
        }
    }

    const onChangeEmploymentType = (event: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target
        if (checked) {
            setActiveEmploymentTypes((prev) => [...prev, value])
        } else {
            setActiveEmploymentTypes((prev) => prev.filter((type) => type !== value))
        }
    }

    const onChangeSalaryRange = (event: ChangeEvent<HTMLInputElement>) => {
        setActiveSalaryRange(event.target.value)
    }

    const renderPagination = () => {
        if (totalPages <= 1) return null

        const pageNumbers = []
        // Show previous 2, current, next 2
        for (let i = Math.max(1, activePage - 2); i <= Math.min(totalPages, activePage + 2); i++) {
            pageNumbers.push(i)
        }

        return (
            <div className="pagination-container">
                <button
                    className="pagination-button"
                    disabled={activePage === 1}
                    onClick={() => setActivePage((prev) => prev - 1)}
                >
                    Prev
                </button>
                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        className={`pagination-button ${activePage === page ? 'active' : ''}`}
                        onClick={() => setActivePage(page)}
                    >
                        {page}
                    </button>
                ))}
                <button
                    className="pagination-button"
                    disabled={activePage === totalPages}
                    onClick={() => setActivePage((prev) => prev + 1)}
                >
                    Next
                </button>
            </div>
        )
    }

    return (
        <div className="jobs-container">
            <Header />
            <div className="jobs-content">
                <div className="sidebar">
                    {profile && (
                        <div className="profile-card">
                            <img src={profile.profileImageUrl} alt="profile" className="profile-avatar" />
                            <h1 className="profile-name">{profile.name}</h1>
                            <p className="profile-bio">{profile.shortBio}</p>
                        </div>
                    )}
                    <div className="filter-group">
                        <h1 className="filter-heading">Type of Employment</h1>
                        <ul>
                            {employmentTypesList.map((eachType) => (
                                <li className="filter-item" key={eachType.employmentTypeId}>
                                    <input
                                        type="checkbox"
                                        id={eachType.employmentTypeId}
                                        value={eachType.employmentTypeId}
                                        onChange={onChangeEmploymentType}
                                    />
                                    <label htmlFor={eachType.employmentTypeId}>{eachType.label}</label>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="filter-group">
                        <h1 className="filter-heading">Salary Range</h1>
                        <ul>
                            {salaryRangesList.map((eachRange) => (
                                <li className="filter-item" key={eachRange.salaryRangeId}>
                                    <input
                                        type="radio"
                                        id={eachRange.salaryRangeId}
                                        name="salary"
                                        value={eachRange.salaryRangeId}
                                        onChange={onChangeSalaryRange}
                                    />
                                    <label htmlFor={eachRange.salaryRangeId}>{eachRange.label}</label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="jobs-list-container">
                    <div className="search-container">
                        <input
                            type="search"
                            className="search-input"
                            placeholder="Search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={onSearchEnter}
                        />
                        <button
                            type="button"
                            data-testid="searchButton"
                            className="search-button"
                            onClick={() => {
                                setActivePage(1)
                                getJobs()
                            }}
                        >
                            <BsSearch className="search-icon" />
                        </button>
                    </div>
                    {isLoading ? (
                        <div style={{ color: 'white', textAlign: 'center' }}>Loading...</div>
                    ) : jobs.length > 0 ? (
                        <>
                            <ul>
                                {jobs.map((job) => (
                                    <Link to={`/jobs/${job.jobId}`} className="job-card" key={job.jobId}>
                                        <div className="job-card-header">
                                            <img
                                                src={job.companyLogoUrl}
                                                alt="company logo"
                                                className="company-logo"
                                            />
                                            <div className="job-title-container">
                                                <h2>{job.roleName}</h2>
                                                <div className="rating-container">
                                                    <BsStarFill className="star-icon" />
                                                    <p>{job.stars}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="job-details-row">
                                            <div style={{ display: 'flex' }}>
                                                <div className="job-info-item">
                                                    <MdLocationOn />
                                                    <p>{job.location}</p>
                                                </div>
                                                <div className="job-info-item">
                                                    <BsBriefcaseFill />
                                                    <p>{job.employmentType}</p>
                                                </div>
                                            </div>
                                            <p>{job.salary} LPA</p>
                                        </div>
                                        <hr style={{ borderColor: '#475569', marginBottom: '15px' }} />
                                        <h1 className="job-description-heading">Description</h1>
                                        <p className="job-description">{job.jobDescription}</p>
                                    </Link>
                                ))}
                            </ul>
                            {renderPagination()}
                        </>
                    ) : (
                        <div className="no-jobs-view">
                            <img
                                src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                                alt="no jobs"
                                className="no-jobs-img"
                            />
                            <h1 className="no-jobs-heading">No Jobs Found</h1>
                            <p className="no-jobs-desc">We could not find any jobs. Try other filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Jobs
