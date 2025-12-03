import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BsStarFill, BsBriefcaseFill, BsBoxArrowUpRight } from 'react-icons/bs'
import { MdLocationOn } from 'react-icons/md'
import Header from '../Header'
import { getToken } from '../../utils/token'
import { BASE_URL } from '../../constants/apiConstants'
import './index.css'


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
    skills: string[] // API says strings, but usually it's objects. Let's check apis.txt again.
    // apis.txt: "skills":["HTML5", "CSS5", "Javascript", "React JS", "Redux"]
    // Wait, the screenshot shows icons. The API response in apis.txt only shows strings.
    // But usually in these projects (CCBP), skills have imageUrls.
    // Let's assume strings for now as per apis.txt, but I might need to map them to icons or just display text.
    // Actually, let's look at the screenshot. It shows icons.
    // If the API only returns strings, I can't show icons unless I have a mapping.
    // Let's check apis.txt again.
    // Line 51: "skills":["HTML5", "CSS5", "Javascript", "React JS", "Redux"]
    // Line 53: "lifeAtCompanyImageUrl": "image1"
    // It seems the API documentation might be simplified.
    // I'll stick to what the API returns. If it's strings, I'll just display strings.
    // Or maybe I can use a default icon.
    // Wait, I'll check if I can find a mapping or if I should just display text.
    // I'll display text for now to be safe.

    lifeAtCompanyDescription: string
    lifeAtCompanyImageUrl: string
    companyPageUrl: string
}

interface SimilarJob {
    jobId: string // apis.txt says "jobid" (lowercase) in one place and "jobId" in another. I'll check the response.
    // apis.txt line 71: "jobid":"xyz123"
    // line 15: "jobId": "abc123"
    // I'll handle both or check the actual response if possible.
    // I'll assume camelCase "jobId" as per standard, but check for "jobid" if needed.
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
            const detailsResponse = await fetch(`${BASE_URL}/dashboard/get-job-details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, jobId: id }),
            })

            if (detailsResponse.ok) {
                const data = await detailsResponse.json()
                if (data.data) {
                    // Map API response to state
                    // The API response structure in apis.txt:
                    // { "jobId": ..., "skills": [...], "LifeAtCompanyDescription": ..., "LifeAtCompanyImageUrl": ... }
                    // Note capitalization in apis.txt: "LifeAtCompanyDescription" vs "lifeAtCompanyDescription"
                    // I'll handle potential case differences.
                    const jobData = data.data
                    setJobDetails({
                        ...jobData,
                        lifeAtCompanyDescription: jobData.LifeAtCompanyDescription || jobData.lifeAtCompanyDescription,
                        lifeAtCompanyImageUrl: jobData.LifeAtCompanyImageUrl || jobData.lifeAtCompanyImageUrl,
                    })
                }
            } else {
                setError('Failed to load job details')
            }

            // Fetch Similar Jobs
            const similarResponse = await fetch(`${BASE_URL}/dashboard/get-similar-jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, jobId: id }),
            })

            if (similarResponse.ok) {
                const data = await similarResponse.json()
                if (data.similarJobs) {
                    setSimilarJobs(data.similarJobs.map((job: any) => ({
                        ...job,
                        jobId: job.jobid || job.jobId // Handle case difference
                    })))
                }
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
                        <li className="similar-job-card" key={job.jobId}>
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
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default JobItemDetails
