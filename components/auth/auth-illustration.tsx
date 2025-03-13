interface AuthIllustrationProps {
  title: string
  description: string
  imageSrc?: string
}

export function AuthIllustration({
  title,
  description,
  imageSrc = "/placeholder.svg?height=600&width=600",
}: AuthIllustrationProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-primary/10 items-center justify-center p-12">
      <div className="max-w-lg">
        <img src={imageSrc || "/placeholder.svg"} alt="Hospital Management System" className="mx-auto" />
        <h1 className="mt-6 text-3xl font-bold text-center text-primary">{title}</h1>
        <p className="mt-4 text-lg text-center text-gray-600">{description}</p>
      </div>
    </div>
  )
}

