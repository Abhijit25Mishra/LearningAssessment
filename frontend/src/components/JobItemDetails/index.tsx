import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BsStarFill, BsBriefcaseFill, BsBoxArrowUpRight } from 'react-icons/bs'
import { MdLocationOn } from 'react-icons/md'
import Header from '../Header'
import { getToken } from '../../utils/token'
import { Link } from 'react-router-dom'
import './index.css'
import { getJobDetails, getSimilarJobs } from '../../services/jobService'


interface JobDetails {
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
    skills: string[]

    lifeAtCompanyDescription: string
    lifeAtCompanyImageUrl: string
    companyPageUrl: string
}

interface SimilarJob {
    jobId: string
    roleName: string
    companyLogoUrl: string
    stars: number
    jobDescription: string
    location: string
    employmentType: string
}

const JobItemDetails = () => {
    const { id } = useParams()
    const [jobDetails, setJobDetails] = useState<JobDetails | null>(null)
    const [similarJobs, setSimilarJobs] = useState<SimilarJob[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getJobData()
    }, [id])

    const getJobData = async () => {
        setIsLoading(true)
        setError('')
        const token = getToken()

        try {
            // Fetch Job Details
            const data = await getJobDetails(token, id)
            if (data.data) {
                const jobData = data.data
                setJobDetails({
                    ...jobData,
                    lifeAtCompanyDescription: jobData.LifeAtCompanyDescription || jobData.lifeAtCompanyDescription,
                    lifeAtCompanyImageUrl: jobData.LifeAtCompanyImageUrl || jobData.lifeAtCompanyImageUrl,
                })
            } else {
                setError('Failed to load job details')
            }

            // Fetch Similar Jobs
            const similarData = await getSimilarJobs(token, id)
            // console.log('Similar jobs response:', similarData)
            if (similarData.similarJobs) {
                setSimilarJobs(similarData.similarJobs)
            }

        } catch (err) {
            console.error(err)
            setError('Something went wrong')
        }
        setIsLoading(false)
    }

    if (isLoading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>
    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>
    if (!jobDetails) return null

    return (
        <div className="job-details-container">
            <Header />
            <div className="job-details-content">
                <div className="job-details-card">
                    <div className="job-card-header">
                        <img
                            src={jobDetails.companyLogoUrl}
                            alt="job details company logo"
                            className="company-logo"
                        />
                        <div className="job-title-container">
                            <h2>{jobDetails.roleName}</h2>
                            <div className="rating-container">
                                <BsStarFill className="star-icon" />
                                <p>{jobDetails.stars}</p>
                            </div>
                        </div>
                    </div>
                    <div className="job-details-row">
                        <div style={{ display: 'flex' }}>
                            <div className="job-info-item">
                                <MdLocationOn />
                                <p>{jobDetails.location}</p>
                            </div>
                            <div className="job-info-item">
                                <BsBriefcaseFill />
                                <p>{jobDetails.employmentType}</p>
                            </div>
                        </div>
                        <p>{jobDetails.salary} LPA</p>
                    </div>
                    <div className="job-details-row">
                        <h1 className="job-description-heading">Description</h1>
                        <a href={jobDetails.companyPageUrl} className="visit-link" target="_blank" rel="noreferrer">
                            Visit <BsBoxArrowUpRight />
                        </a>
                    </div>
                    <p className="job-description">{jobDetails.jobDescription}</p>

                    <h1 className="job-description-heading" style={{ marginTop: '30px' }}>Skills</h1>
                    <div className="skills-container">
                        {jobDetails.skills && jobDetails.skills.map((skill, index) => (
                            <div className="skill-item" key={index}>
                                {/* Since we don't have images for skills, we'll just show text or a placeholder */}
                                <p className="skill-name">{skill}</p>
                            </div>
                        ))}
                    </div>

                    <h1 className="job-description-heading">Life at Company</h1>
                    <div className="life-at-company-container">
                        <p className="life-at-company-description">{jobDetails.lifeAtCompanyDescription}</p>
                        {jobDetails.lifeAtCompanyImageUrl && (
                            <img src={jobDetails.lifeAtCompanyImageUrl} alt="life at company" className="life-at-company-image" />
                        )}
                    </div>
                </div>

                <h1 className="similar-jobs-heading">Similar Jobs</h1>
                <ul className="similar-jobs-list">
                    {similarJobs.map((job) => (
                        <Link to={`/jobs/${job.jobId}`} className="similar-job-card" key={job.jobId}>
                            <div className="job-card-header">
                                <img
                                    src={job.companyLogoUrl}
                                    alt="similar job company logo"
                                    className="similar-job-logo"
                                />
                                <div className="job-title-container">
                                    <h2 className="similar-job-title">{job.roleName}</h2>
                                    <div className="rating-container">
                                        <BsStarFill className="star-icon" />
                                        <p>{job.stars}</p>
                                    </div>
                                </div>
                            </div>
                            <h1 className="job-description-heading" style={{ fontSize: '16px' }}>Description</h1>
                            <p className="similar-job-description">{job.jobDescription}</p>
                            <div className="job-details-row" style={{ marginTop: '10px' }}>
                                <div className="job-info-item">
                                    <MdLocationOn />
                                    <p>{job.location}</p>
                                </div>
                                <div className="job-info-item">
                                    <BsBriefcaseFill />
                                    <p>{job.employmentType}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </ul>
            </div>
        </div >
    )
}

export default JobItemDetails
