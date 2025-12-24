'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FaUpload, FaDownload, FaLink, FaFileAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function FileShare() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchFiles()

    const channel = supabase
      .channel('realtime-files')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'files' },
        () => fetchFiles()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchFiles() {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setFiles(data || [])
  }

  async function uploadFile(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)

    const filePath = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from('community-files')
      .upload(filePath, file)

    if (error) {
      alert(error.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('community-files')
      .getPublicUrl(filePath)

    await supabase.from('files').insert({
      name: file.name,
      url: urlData.publicUrl,
      size: (file.size / 1024).toFixed(1) + ' KB',
      uploaded_by: 'Community User'
    })

    setUploading(false)
  }

  function copyLink(url) {
    navigator.clipboard.writeText(url)
    alert('Link copied!')
  }

  function renderPreview(url, name) {
    const ext = name.split('.').pop().toLowerCase()

    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
      return (
        <img
          src={url}
          alt={name}
          className="w-full h-40 object-cover rounded-lg"
        />
      )
    }

    if (ext === 'pdf') {
      return (
        <iframe
          src={url}
          className="w-full h-40 rounded-lg"
        />
      )
    }

    if (['mp4', 'webm'].includes(ext)) {
      return (
        <video
          src={url}
          controls
          className="w-full h-40 rounded-lg"
        />
      )
    }

    if (['mp3', 'wav'].includes(ext)) {
      return (
        <audio
          src={url}
          controls
          className="w-full"
        />
      )
    }

    return (
      <div className="h-40 flex items-center justify-center bg-gray-100 rounded-lg">
        <FaFileAlt className="text-4xl text-gray-400" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">📂 Community File Sharing</h2>

        <label className="cursor-pointer flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg w-fit">
          <FaUpload />
          {uploading ? 'Uploading...' : 'Upload File'}
          <input type="file" hidden onChange={uploadFile} />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map(file => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow p-4"
          >
            {renderPreview(file.url, file.name)}

            <div className="flex justify-between items-center mt-3">
              <div>
                <p className="font-semibold truncate w-48">{file.name}</p>
                <p className="text-xs text-gray-500">{file.size}</p>
              </div>

              <div className="flex gap-3 text-lg">
                <a href={file.url} download target="_blank">
                  <FaDownload />
                </a>
                <FaLink
                  className="cursor-pointer"
                  onClick={() => copyLink(file.url)}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
