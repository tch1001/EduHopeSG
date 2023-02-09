import Head from 'next/head'

export const HeadProperties = ({
    pageTitle,
    title = "EduHope",
    description = "Empowering students through free and flexible tutoring. — Find your volunteer tutor today!",
}) => {
    const compoundedTitle = pageTitle ? `${pageTitle} - ${title}` : title;

    return (
        <Head>
            <link rel="icon" href="/favicon.ico" />
            <meta charset="UTF-8" />
            <meta name="language" content="en-SG" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <title>{compoundedTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content="free tutor, singapore, n level, o level, a level" />

            <meta name="author" content="EduHope Team, contact@eduhopesg.com" />
            <meta name="owner" content="EduHope Team, contact@eduhopesg.com" />
            <meta name="designer" content="EduHope Team, contact@eduhopesg.com" />
            <meta name="reply-to" content="contact@eduhopesg.com" />
            <meta name="url" content="https://eduhopesg.com" />
            <meta name="identifier-URL" content="https://eduhopesg.com" />

            <meta name="coverage" content="Singapore" />
            <meta name="distribution" content="Singapore" />
            <meta name="target" content="All" />
            <meta name="HandheldFriendly" content="True" />
            <meta name="MobileOptimized" content="320" />

            {/* for SEO */}
            {pageTitle ? <meta name="pagename" content={pageTitle} /> : ""}

            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={pageTitle} />
            <meta property="og:email" content="contact@eduhopesg.com" />
            <meta property="og:country-name" content="SG" />
        </Head>
    )
}