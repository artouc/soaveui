import { useSeoMeta as useNuxtSeoMeta, useHead } from "#app"
import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from "vue"

export interface SoaveSeoMetaOptions {
    title: MaybeRefOrGetter<string>
    description?: MaybeRefOrGetter<string>
    image?: MaybeRefOrGetter<string>
    url?: MaybeRefOrGetter<string>
    type?: MaybeRefOrGetter<"website" | "article" | "product" | "profile">
    site_name?: MaybeRefOrGetter<string>
    locale?: MaybeRefOrGetter<string>
    twitter_card?: MaybeRefOrGetter<"summary" | "summary_large_image" | "player" | "app">
    author?: MaybeRefOrGetter<string>
    published_time?: MaybeRefOrGetter<string>
    modified_time?: MaybeRefOrGetter<string>
    keywords?: MaybeRefOrGetter<string[]>
    robots?: MaybeRefOrGetter<string>
}

export interface StructuredDataBreadcrumb {
    name: string
    url: string
}

export interface StructuredDataOptions {
    breadcrumbs?: StructuredDataBreadcrumb[]
    article?: {
        headline: string
        author: string
        published_date: string
        modified_date?: string
        image?: string
    }
    organization?: {
        name: string
        url: string
        logo?: string
    }
    product?: {
        name: string
        description: string
        price: number
        currency: string
        image?: string
        availability?: "InStock" | "OutOfStock" | "PreOrder"
    }
}

export function useSoaveSeoMeta(options: SoaveSeoMetaOptions): void {
    const title = computed(() => toValue(options.title))
    const description = computed(() => toValue(options.description))
    const image = computed(() => toValue(options.image))
    const url = computed(() => toValue(options.url))
    const type = computed(() => toValue(options.type) || "website")
    const site_name = computed(() => toValue(options.site_name))
    const locale = computed(() => toValue(options.locale))
    const twitter_card = computed(() => toValue(options.twitter_card) || "summary_large_image")
    const author = computed(() => toValue(options.author))
    const keywords = computed(() => toValue(options.keywords))
    const robots = computed(() => toValue(options.robots))

    useNuxtSeoMeta({
        title: title,
        description: description,
        ogTitle: title,
        ogDescription: description,
        ogImage: image,
        ogUrl: url,
        ogType: type as ComputedRef<string>,
        ogSiteName: site_name,
        ogLocale: locale,
        twitterCard: twitter_card,
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: image,
        author: author,
        robots: robots
    })

    // Add keywords meta tag separately via useHead
    if (options.keywords) {
        useHead({
            meta: [
                {
                    name: "keywords",
                    content: keywords
                }
            ]
        })
    }

    // Add article meta tags if provided
    if (options.published_time || options.modified_time) {
        useHead({
            meta: [
                ...(options.published_time
                    ? [{
                        property: "article:published_time",
                        content: computed(() => toValue(options.published_time))
                    }]
                    : []),
                ...(options.modified_time
                    ? [{
                        property: "article:modified_time",
                        content: computed(() => toValue(options.modified_time))
                    }]
                    : [])
            ]
        })
    }
}

export function useStructuredData(options: StructuredDataOptions): void {
    const scripts: { type: string; innerHTML: string }[] = []

    // Breadcrumb structured data
    if (options.breadcrumbs && options.breadcrumbs.length > 0) {
        const breadcrumb_list = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": options.breadcrumbs.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url
            }))
        }
        scripts.push({
            type: "application/ld+json",
            innerHTML: JSON.stringify(breadcrumb_list)
        })
    }

    // Article structured data
    if (options.article) {
        const article = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": options.article.headline,
            "author": {
                "@type": "Person",
                "name": options.article.author
            },
            "datePublished": options.article.published_date,
            ...(options.article.modified_date && { "dateModified": options.article.modified_date }),
            ...(options.article.image && { "image": options.article.image })
        }
        scripts.push({
            type: "application/ld+json",
            innerHTML: JSON.stringify(article)
        })
    }

    // Organization structured data
    if (options.organization) {
        const organization = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": options.organization.name,
            "url": options.organization.url,
            ...(options.organization.logo && { "logo": options.organization.logo })
        }
        scripts.push({
            type: "application/ld+json",
            innerHTML: JSON.stringify(organization)
        })
    }

    // Product structured data
    if (options.product) {
        const product = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": options.product.name,
            "description": options.product.description,
            ...(options.product.image && { "image": options.product.image }),
            "offers": {
                "@type": "Offer",
                "price": options.product.price,
                "priceCurrency": options.product.currency,
                ...(options.product.availability && { "availability": `https://schema.org/${options.product.availability}` })
            }
        }
        scripts.push({
            type: "application/ld+json",
            innerHTML: JSON.stringify(product)
        })
    }

    if (scripts.length > 0) {
        useHead({
            script: scripts
        })
    }
}
